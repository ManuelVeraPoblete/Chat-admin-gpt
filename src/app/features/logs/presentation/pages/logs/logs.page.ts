import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TopNavComponent } from '../../../../db-dashboard/presentation/components/top-nav/top-nav.component';
import { TokenStorageService } from '../../../../../core/auth/token-storage.service';

import { LogsFacade } from '../../../application/logs.facade';
import { GetLogsUseCase } from '../../../application/use-cases/get-logs.usecase';
import { LOGS_REPOSITORY } from '../../../domain/ports/logs.repository';
import { LogsRepositoryHttp } from '../../../infrastructure/repositories/logs.repository.http';
import { LogsQuery } from '../../../domain/models/logs-query';

/** Forms tipados (sin casts en template) */
type TokenForm = FormGroup<{
  token: FormControl<string>;
}>;

type FilterForm = FormGroup<{
  q: FormControl<string>;
  level: FormControl<string>; // '' | INFO | WARN | ERROR | DEBUG
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}>;

type ParsedLog = {
  level?: number;
  time?: string;
  service?: string;
  type?: string;
  traceId?: string | null;
  userId?: string | null;
  method?: string;
  url?: string;
  ip?: string;
  params?: unknown;
  query?: unknown;
  body?: unknown;
  msg?: string;
  [k: string]: unknown;
};

@Component({
  selector: 'app-logs-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,

    TopNavComponent,

    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './logs.page.html',
  styleUrl: './logs.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    LogsFacade,
    GetLogsUseCase,
    LogsRepositoryHttp,
    { provide: LOGS_REPOSITORY, useExisting: LogsRepositoryHttp },
  ],
})
export class LogsPage implements OnInit {
  /**
   * ✅ Tabla "completa":
   * - Separación fecha/hora
   * - Campos clave del log (service/type/method/url/ip/traceId/userId)
   * - Mantiene botón de detalle para ver el JSON completo
   */
  readonly displayedColumns = [
    'details',
    'index',
    'date',
    'time',
    'level',
    'service',
    'type',
    'method',
    'url',
    'ip',
    'traceId',
    'userId',
    'message',
  ];

  /** Fila expandida por index (null => ninguna) */
  readonly expandedIndex = signal<number | null>(null);

  private readonly page = signal(1);
  private readonly size = signal(25);
  private readonly tail = signal(20000);

  readonly tokenForm: TokenForm;
  readonly filterForm: FilterForm;

  /**
   * Cache para no parsear JSON 20 veces por fila en cada change detection.
   * - Key: row.index (tu backend ya lo trae)
   */
  private readonly parsedCache = new Map<number, ParsedLog | null>();

  constructor(
    public readonly facade: LogsFacade,
    private readonly fb: FormBuilder,
    private readonly tokenStorage: TokenStorageService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.tokenForm = this.fb.nonNullable.group({
      token: this.fb.nonNullable.control(this.tokenStorage.getToken() ?? ''),
    });

    this.filterForm = this.fb.nonNullable.group({
      q: this.fb.nonNullable.control(''),
      level: this.fb.nonNullable.control(''),
      from: this.fb.control<Date | null>(null),
      to: this.fb.control<Date | null>(null),
    });
  }

  // Getters para template
  get tokenCtrl(): FormControl<string> {
    return this.tokenForm.controls.token;
  }
  get qCtrl(): FormControl<string> {
    return this.filterForm.controls.q;
  }
  get levelCtrl(): FormControl<string> {
    return this.filterForm.controls.level;
  }
  get fromCtrl(): FormControl<Date | null> {
    return this.filterForm.controls.from;
  }
  get toCtrl(): FormControl<Date | null> {
    return this.filterForm.controls.to;
  }

  ngOnInit(): void {
    this.load();
  }

  onRefresh(): void {
    this.load();
    this.snackBar.open('Actualizando logs...', 'OK', { duration: 1200 });
  }

  onSaveToken(): void {
    const token = this.tokenCtrl.value.trim();
    if (!token) {
      this.tokenStorage.clear();
      this.snackBar.open('Token limpiado.', 'OK', { duration: 1200 });
      return;
    }
    this.tokenStorage.setToken(token);
    this.snackBar.open('Token guardado.', 'OK', { duration: 1200 });
  }

  onApplyFilters(): void {
    this.page.set(1);
    this.load();
  }

  onPage(e: PageEvent): void {
    this.size.set(e.pageSize);
    this.page.set(e.pageIndex + 1);
    this.load();
  }

  private load(): void {
    // ✅ al recargar, limpiamos cache (los índices cambian / dataset cambia)
    this.parsedCache.clear();

    const q = this.qCtrl.value.trim();
    const level = this.levelCtrl.value;
    const from = this.fromCtrl.value;
    const to = this.toCtrl.value;

    const query: LogsQuery = {
      page: this.page(),
      size: this.size(),
      tail: this.tail(),

      q: q.length ? q : undefined,
      level: level ? (level as any) : undefined,
      from: from ? from.toISOString() : undefined,
      to: to ? to.toISOString() : undefined,
    };

    this.facade.load(query);
  }

  /**
   * MatTable helper: intercalamos fila normal + fila detalle.
   */
  buildTableRows(items: any[]): any[] {
    const rows: any[] = [];
    for (const it of items ?? []) {
      rows.push(it);
      rows.push({ __detail: true, parent: it });
    }
    return rows;
  }

  /**
   * Badge por nivel.
   */
  levelClass(level: string): string {
    switch (level) {
      case 'INFO': return 'badge info';
      case 'WARN': return 'badge warn';
      case 'ERROR': return 'badge error';
      case 'DEBUG': return 'badge debug';
      default: return 'badge unknown';
    }
  }

  toggleRowDetails(rowIndex: number): void {
    this.expandedIndex.set(this.expandedIndex() === rowIndex ? null : rowIndex);
  }

  isExpanded(rowIndex: number): boolean {
    return this.expandedIndex() === rowIndex;
  }

  /**
   * ✅ Parseo con cache.
   * - row.raw es un string JSON (como el que enviaste)
   * - si falla, retorna null
   */
  parsed(row: any): ParsedLog | null {
    const idx = Number(row?.index);
    if (!Number.isFinite(idx)) return null;

    if (this.parsedCache.has(idx)) {
      return this.parsedCache.get(idx) ?? null;
    }

    const raw = String(row?.raw ?? '');
    const parsed = this.parseRaw(raw);
    this.parsedCache.set(idx, parsed);
    return parsed;
  }

  private parseRaw(raw: string): ParsedLog | null {
    try {
      return JSON.parse(raw) as ParsedLog;
    } catch {
      return null;
    }
  }

  /**
   * Pretty print seguro (para el panel detalle).
   */
  prettyJson(value: unknown): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  /**
   * Helpers para MatTable (filas normales/detalle).
   */
  isDetailRow = (_: number, row: any): boolean => row?.__detail === true;
  isNormalRow = (_: number, row: any): boolean => !row?.__detail;
}
