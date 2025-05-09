import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cluster } from '../cluster-management.component';
import { ResourceItemComponent } from './resource-item.component';

@Component({
  selector: 'app-resource-details-dialog',
  standalone: true,
  imports: [CommonModule, ResourceItemComponent],
  template: `
    <div class="resource-details-dialog">
      <div class="dialog-header">
        <h2>Resource Usage Details</h2>
        <button class="btn btn-icon" (click)="onClose()">
          <i class="icon-close"></i>
        </button>
      </div>

      <div class="dialog-content">
        <div class="resource-details">
          <app-resource-item
            title="CPU Limits"
            [used]="cluster.used.limitsCPU"
            [max]="cluster.max.limitsCPU"
            unit="CPU"
          ></app-resource-item>

          <app-resource-item
            title="CPU Requests"
            [used]="cluster.used.requestsCPU"
            [max]="cluster.max.requestsCPU"
            unit="CPU"
          ></app-resource-item>

          <app-resource-item
            title="Memory Limits"
            [used]="cluster.used.limitsMemory"
            [max]="cluster.max.limitsMemory"
            unit="Mi"
          ></app-resource-item>

          <app-resource-item
            title="Memory Requests"
            [used]="cluster.used.requestsMemory"
            [max]="cluster.max.requestsMemory"
            unit="Mi"
          ></app-resource-item>

          <app-resource-item
            title="Pods Usage"
            [used]="cluster.used.pods"
            [max]="cluster.max.pods"
            unit="Pods"
          ></app-resource-item>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn btn-secondary" (click)="onClose()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .resource-details-dialog {
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

    .dialog-content {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .dialog-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }

    .resource-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
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
      .resource-details {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  `]
})
export class ResourceDetailsDialogComponent {
  @Input() cluster!: Cluster;
  @Input() onClose!: () => void;
}