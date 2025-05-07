import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cluster } from './cluster-management.component';

@Component({
  selector: 'app-cluster-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="cluster-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Namespace</th>
            <th>Created By</th>
            <th>Reserved CPU</th>
            <th>Assigned Projects</th>
            <th>Resource Usage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (cluster of clusters; track cluster.id) {
            <tr>
              <td>{{cluster.name}}</td>
              <td>
                <span class="cluster-type" [class]="cluster.type">
                  {{cluster.type === 'public' ? 'Public' : 'Private'}}
                </span>
              </td>
              <td>{{cluster.namespace}}</td>
              <td>{{cluster.createdBy}}</td>
              <td>{{cluster.reservedCPU}} cores</td>
              <td>
                <div class="project-tags">
                  @for (project of cluster.assignedProjects; track project) {
                    <span class="tag">{{project}}</span>
                  }
                </div>
              </td>
              <td>
                <div class="resource-usage" (click)="showResourceDetails(cluster)">
                  <div class="usage-summary">
                    <div class="circular-progress small">
                      <svg viewBox="0 0 36 36" class="circular-chart">
                        <path class="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path class="circle"
                          [style.strokeDasharray]="getAverageUsage(cluster) + ', 100'"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" class="percentage">{{getAverageUsage(cluster)}}%</text>
                      </svg>
                    </div>
                    <span class="usage-text">Resource Usage</span>
                    <i class="icon-expand"></i>
                  </div>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-icon" (click)="onEdit.emit(cluster)" title="Edit">
                    <i class="icon-edit"></i>
                  </button>
                  <button class="btn btn-icon btn-danger" (click)="onDelete.emit(cluster)" title="Delete">
                    <i class="icon-trash"></i>
                  </button>
                  <button class="btn btn-icon" (click)="onViewPods.emit(cluster)" title="View Pods Template">
                    <i class="icon-code"></i>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (selectedCluster) {
      <div class="modal-overlay" (click)="closeResourceDetails()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Resource Quota Details</h2>
            <button class="btn-close" (click)="closeResourceDetails()">×</button>
          </div>
          
          <div class="cluster-info">
            <span class="cluster-name">{{selectedCluster.name}}</span>
            <span class="cluster-type" [class]="selectedCluster.type">
              {{selectedCluster.type === 'public' ? 'Public' : 'Private'}}
            </span>
          </div>
          
          <div class="resource-grid">
            @for (quota of selectedCluster.resourceQuota; track quota.type) {
              <div class="resource-card">
                <div class="resource-header">
                  <h3 class="resource-type">{{quota.type}}</h3>
                  <div class="resource-values">
                    <span class="value-label">Used:</span>
                    <span class="value">{{quota.used}}</span>
                    <span class="value-label">Max:</span>
                    <span class="value">{{quota.max}}</span>
                  </div>
                </div>
                
                <div class="circular-progress">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                      [style.strokeDasharray]="quota.capacity + ', 100'"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">{{quota.capacity}}%</text>
                  </svg>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: auto;
    }

    .cluster-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;

      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        background: #f5f5f5;
        font-weight: 600;
        color: #333;
        white-space: nowrap;
      }

      tr:hover {
        background: #f8f9fa;
      }

      td {
        vertical-align: middle;
      }
    }

    .cluster-type {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-block;

      &.public {
        background: #2196F3;
        color: white;
      }

      &.private {
        background: #E0E0E0;
        color: #424242;
      }
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .tag {
      background: #E3F2FD;
      color: #1976D2;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.75rem;
    }

    .resource-usage {
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background: #f5f5f5;
      }
    }

    .usage-summary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .circular-progress {
      &.small {
        width: 40px;
        height: 40px;
      }
    }

    .circular-chart {
      width: 100%;
      height: 100%;
    }

    .circle-bg {
      fill: none;
      stroke: #E0E0E0;
      stroke-width: 3;
    }

    .circle {
      fill: none;
      stroke: #2196F3;
      stroke-width: 3;
      stroke-linecap: round;
      animation: progress 1s ease-out forwards;
    }

    .percentage {
      fill: #666;
      font-size: 0.5em;
      text-anchor: middle;
    }

    @keyframes progress {
      0% {
        stroke-dasharray: 0 100;
      }
    }

    .usage-text {
      font-size: 0.875rem;
      color: #666;
    }

    .icon-expand {
      margin-left: auto;
      transition: transform 0.2s;

      &::before {
        content: '▼';
        font-size: 0.75rem;
      }
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-start;
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

      &.btn-primary {
        background: #2196F3;
        color: white;

        &:hover {
          background: #1976D2;
        }
      }

      &.btn-secondary {
        background: #E0E0E0;
        color: #424242;

        &:hover {
          background: #BDBDBD;
        }
      }

      &.btn-danger {
        background: #F44336;
        color: white;

        &:hover {
          background: #D32F2F;
        }
      }

      &.btn-icon {
        padding: 0.5rem;
        border-radius: 50%;

        i {
          font-size: 1rem;
        }
      }
    }

    .icon-plus::before { content: '+'; }
    .icon-edit::before { content: '✎'; }
    .icon-trash::before { content: '🗑'; }
    .icon-code::before { content: '</>'; }
    .icon-close::before { content: '×'; }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
      }
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
      border-radius: 50%;

      &:hover {
        background: #f5f5f5;
      }
    }

    .cluster-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .cluster-name {
      font-size: 1.125rem;
      font-weight: 500;
      color: #333;
    }

    .resource-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .resource-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }

    .resource-header {
      margin-bottom: 1rem;
    }

    .resource-type {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: #333;
    }

    .resource-values {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .value-label {
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #333;
    }
  `]
})
export class ClusterTableComponent {
  @Input() clusters: Cluster[] = [];
  @Output() onEdit = new EventEmitter<Cluster>();
  @Output() onDelete = new EventEmitter<Cluster>();
  @Output() onViewPods = new EventEmitter<Cluster>();

  selectedCluster: Cluster | null = null;

  showResourceDetails(cluster: Cluster) {
    this.selectedCluster = cluster;
  }

  closeResourceDetails() {
    this.selectedCluster = null;
  }

  getAverageUsage(cluster: Cluster): number {
    const total = cluster.resourceQuota.reduce((sum, quota) => sum + quota.capacity, 0);
    return Math.round(total / cluster.resourceQuota.length);
  }
} 