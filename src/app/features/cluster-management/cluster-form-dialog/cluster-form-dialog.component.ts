import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cluster } from '../cluster-management.component';

@Component({
  selector: 'app-cluster-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cluster-form-dialog">
      <div class="dialog-header">
        <h2>{{ isEdit ? 'Edit Cluster' : 'Create New Cluster' }}</h2>
        <button class="btn btn-icon" (click)="onClose()">
          <i class="icon-close"></i>
        </button>
      </div>

      <!-- ABCID Access Warning -->
      <div class="warning-banner" *ngIf="!isEdit">
        <div class="warning-icon">⚠️</div>
        <div class="warning-content">
          <h3>Prerequisite: ABCID Access Required</h3>
          <p>Before creating a new cluster, please ensure that your ABCID has been granted access permissions to the target cluster. Contact your cluster administrator if you need assistance.</p>
        </div>
      </div>

      <form [formGroup]="clusterForm" (ngSubmit)="onSubmit(clusterForm)" class="dialog-content">
        <!-- Basic Information Section -->
        <div class="form-section">
          <h3>Basic Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Cluster Name</label>
              <input id="name" type="text" formControlName="name" placeholder="Enter cluster name">
            </div>

            <div class="form-group">
              <label for="type">Cluster Type</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" formControlName="type" value="private">
                  <span>Private</span>
                  <div class="radio-description">Only creator can manage project access</div>
                </label>
                <label class="radio-label">
                  <input type="radio" formControlName="type" value="public">
                  <span>Public</span>
                  <div class="radio-description">All projects can access, requires admin/support for modifications</div>
                </label>
              </div>
            </div>
          </div>

          <!-- Public Cluster Warning -->
          <div class="warning-box" *ngIf="clusterForm.get('type')?.value === 'public'">
            <h4>⚠️ Important Notice</h4>
            <p>Setting this cluster as public means:</p>
            <ul>
              <li>All projects will have access to this cluster</li>
              <li>You will not be able to modify the cluster settings after creation</li>
              <li>Any future modifications will require admin or support team assistance</li>
            </ul>
            <p>Please confirm this is what you want to do.</p>
          </div>
        </div>

        <!-- Resource Configuration Section -->
        <div class="form-section">
          <h3>Resource Configuration</h3>
          <div class="reference-values" *ngIf="referenceValues">
            <h4>Cluster Total Resources (Reference)</h4>
            <div class="reference-grid">
              <div class="reference-item">
                <span class="label">Total Request CPU:</span>
                <span class="value">{{ referenceValues.totalRequestCPU }} CPU</span>
              </div>
              <div class="reference-item">
                <span class="label">Total Limit CPU:</span>
                <span class="value">{{ referenceValues.totalLimitCPU }} CPU</span>
              </div>
              <div class="reference-item">
                <span class="label">Total Request Memory:</span>
                <span class="value">{{ referenceValues.totalRequestMemory }} Mi</span>
              </div>
              <div class="reference-item">
                <span class="label">Total Limit Memory:</span>
                <span class="value">{{ referenceValues.totalLimitMemory }} Mi</span>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="reservedRequestCPU">Reserved Request CPU</label>
              <div class="input-with-hint">
                <input id="reservedRequestCPU" type="number" formControlName="reservedRequestCPU" 
                       [placeholder]="'Enter CPU (max: ' + referenceValues?.totalRequestCPU + ')'">
                <div class="hint">CPU units (e.g., 0.5, 1, 2)</div>
              </div>
            </div>

            <div class="form-group">
              <label for="reservedLimitCPU">Reserved Limit CPU</label>
              <div class="input-with-hint">
                <input id="reservedLimitCPU" type="number" formControlName="reservedLimitCPU"
                       [placeholder]="'Enter CPU (max: ' + referenceValues?.totalLimitCPU + ')'">
                <div class="hint">CPU units (e.g., 0.5, 1, 2)</div>
              </div>
            </div>

            <div class="form-group">
              <label for="reservedRequestMemory">Reserved Request Memory</label>
              <div class="input-with-hint">
                <input id="reservedRequestMemory" type="number" formControlName="reservedRequestMemory"
                       [placeholder]="'Enter Memory (max: ' + referenceValues?.totalRequestMemory + ')'">
                <div class="hint">Memory in Mi</div>
              </div>
            </div>

            <div class="form-group">
              <label for="reservedLimitMemory">Reserved Limit Memory</label>
              <div class="input-with-hint">
                <input id="reservedLimitMemory" type="number" formControlName="reservedLimitMemory"
                       [placeholder]="'Enter Memory (max: ' + referenceValues?.totalLimitMemory + ')'">
                <div class="hint">Memory in Mi</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button type="button" class="btn btn-secondary" (click)="onClose()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="!clusterForm.valid">Submit</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .cluster-form-dialog {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .warning-banner {
      background: #FFF3E0;
      border: 1px solid #FFE0B2;
      border-radius: 4px;
      margin: 1rem;
      padding: 1rem;
      display: flex;
      gap: 1rem;
    }

    .warning-icon {
      font-size: 1.5rem;
    }

    .warning-content h3 {
      margin: 0 0 0.5rem;
      color: #E65100;
    }

    .warning-content p {
      margin: 0;
      color: #424242;
    }

    .dialog-content {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h3 {
      margin: 0 0 1rem;
      color: #333;
      font-size: 1.1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #424242;
    }

    .input-with-hint {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .hint {
      font-size: 0.75rem;
      color: #757575;
    }

    input[type="text"],
    input[type="number"] {
      padding: 0.75rem;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    input[type="text"]:focus,
    input[type="number"]:focus {
      outline: none;
      border-color: #2196F3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .radio-label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      cursor: pointer;
    }

    .radio-label:hover {
      background: #F5F5F5;
    }

    .radio-description {
      font-size: 0.75rem;
      color: #757575;
      margin-left: 1.5rem;
    }

    .warning-box {
      background: #FFEBEE;
      border: 1px solid #FFCDD2;
      border-radius: 4px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .warning-box h4 {
      margin: 0 0 0.5rem;
      color: #C62828;
    }

    .warning-box ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }

    .warning-box li {
      color: #424242;
      margin-bottom: 0.25rem;
    }

    .reference-values {
      background: #E3F2FD;
      border: 1px solid #BBDEFB;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .reference-values h4 {
      margin: 0 0 0.75rem;
      color: #1565C0;
    }

    .reference-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .reference-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .reference-item .label {
      font-size: 0.75rem;
      color: #424242;
    }

    .reference-item .value {
      font-weight: 500;
      color: #1565C0;
    }

    .dialog-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #2196F3;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1976D2;
    }

    .btn-primary:disabled {
      background: #BDBDBD;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #E0E0E0;
      color: #424242;
    }

    .btn-secondary:hover {
      background: #BDBDBD;
    }

    .btn-icon {
      padding: 0.5rem;
      border-radius: 50%;
      background: none;
    }

    .btn-icon:hover {
      background: #f5f5f5;
    }

    .icon-close::before { content: '×'; }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .reference-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClusterFormDialogComponent implements OnInit {
  @Input() isEdit = false;
  @Input() cluster?: Cluster;
  @Input() onClose!: () => void;
  @Input() onSubmit!: (formData: any) => void;
  @Input() referenceValues?: {
    totalRequestCPU: number;
    totalLimitCPU: number;
    totalRequestMemory: number;
    totalLimitMemory: number;
  };

  clusterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clusterForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['private', [Validators.required]],
      reservedRequestCPU: [null, [Validators.required, Validators.min(0)]],
      reservedLimitCPU: [null, [Validators.required, Validators.min(0)]],
      reservedRequestMemory: [null, [Validators.required, Validators.min(0)]],
      reservedLimitMemory: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.isEdit && this.cluster) {
      this.clusterForm.patchValue(this.cluster);
    }
  }
} 