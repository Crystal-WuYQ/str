import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClusterTableComponent } from './cluster-table.component';

export interface ResourceQuota {
  type: string;
  used: number;
  max: number;
  capacity: number;
}

export interface Cluster {
  id: string;
  name: string;
  namespace: string;
  type: 'public' | 'private';
  createdBy: string;
  assignedProjects: string[];
  reservedCPU: number;
  podsTemplate: string;
  resourceQuota: ResourceQuota[];
}

@Component({
  selector: 'app-cluster-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ClusterTableComponent],
  template: `
    <div class="cluster-management">
      <div class="header">
        <h1>Cluster Management</h1>
        <div class="header-actions">
          <div class="view-toggle">
            <button class="btn" [class.active]="viewMode === 'card'" (click)="viewMode = 'card'" title="Card View">
              <i class="icon-grid"></i>
            </button>
            <button class="btn" [class.active]="viewMode === 'table'" (click)="viewMode = 'table'" title="Table View">
              <i class="icon-table"></i>
            </button>
          </div>
          <button class="btn btn-primary" (click)="showAddDialog()">
            <i class="icon-plus"></i>
            Add Cluster
          </button>
        </div>
      </div>

      @if (viewMode === 'table') {
        <app-cluster-table
          [clusters]="clusters"
          (onEdit)="editCluster($event)"
          (onDelete)="deleteCluster($event)"
          (onViewPods)="viewPodsTemplate($event)">
        </app-cluster-table>
      } @else {
        <div class="cluster-grid">
          @for (cluster of clusters; track cluster.id) {
            <div class="cluster-card">
              <div class="card-header">
                <h2>{{cluster.name}}</h2>
                <span class="cluster-type" [class]="cluster.type">
                  {{cluster.type === 'public' ? 'Public' : 'Private'}}
                </span>
              </div>

              <div class="card-content">
                <div class="info-section">
                  <div class="info-item">
                    <label>Namespace:</label>
                    <span>{{cluster.namespace}}</span>
                  </div>
                  <div class="info-item">
                    <label>Created By:</label>
                    <span>{{cluster.createdBy}}</span>
                  </div>
                  <div class="info-item">
                    <label>Reserved CPU:</label>
                    <span>{{cluster.reservedCPU}} cores</span>
                  </div>
                  <div class="info-item">
                    <label>Assigned Projects:</label>
                    <div class="project-tags">
                      @for (project of cluster.assignedProjects; track project) {
                        <span class="tag">{{project}}</span>
                      }
                    </div>
                  </div>
                </div>

                <div class="quota-section">
                  <h3>Resource Quota</h3>
                  <div class="quota-grid">
                    @for (quota of cluster.resourceQuota; track quota.type) {
                      <div class="quota-item">
                        <div class="quota-header">
                          <span class="quota-type">{{quota.type}}</span>
                          <span class="quota-values">{{quota.used}}/{{quota.max}}</span>
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

              <div class="card-footer">
                <button class="btn btn-icon" (click)="editCluster(cluster)" title="Edit">
                  <i class="icon-edit"></i>
                </button>
                <button class="btn btn-icon btn-danger" (click)="deleteCluster(cluster)" title="Delete">
                  <i class="icon-trash"></i>
                </button>
                <button class="btn btn-icon" (click)="viewPodsTemplate(cluster)" title="View Pods Template">
                  <i class="icon-code"></i>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Add/Edit Cluster Dialog -->
    <div class="modal" [class.show]="showDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{isEditing ? 'Edit Cluster' : 'Add Cluster'}}</h2>
          <button class="btn btn-icon" (click)="showDialog = false">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Cluster Name</label>
            <input type="text" [(ngModel)]="selectedCluster.name" [disabled]="isEditing">
          </div>
          <div class="form-group">
            <label>Namespace</label>
            <input type="text" [(ngModel)]="selectedCluster.namespace" [disabled]="isEditing">
          </div>
          <div class="form-group">
            <label>Cluster Type</label>
            <select [(ngModel)]="selectedCluster.type" [disabled]="isEditing">
              @for (type of clusterTypes; track type.value) {
                <option [value]="type.value">{{type.label}}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Reserved CPU</label>
            <input type="number" [(ngModel)]="selectedCluster.reservedCPU">
          </div>
          <div class="form-group">
            <label>Assigned Projects</label>
            <div class="multi-select">
              @for (project of availableProjects; track project.value) {
                <label class="checkbox">
                  <input type="checkbox" 
                    [checked]="selectedCluster.assignedProjects.includes(project.value)"
                    (change)="toggleProject(project.value)">
                  {{project.label}}
                </label>
              }
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showDialog = false">Cancel</button>
          <button class="btn btn-primary" (click)="saveCluster()">Save</button>
        </div>
      </div>
    </div>

    <!-- Pods Template Dialog -->
    <div class="modal" [class.show]="showPodsDialog">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>Pods Template</h2>
          <button class="btn btn-icon" (click)="showPodsDialog = false">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="editor-container">
            <textarea [(ngModel)]="selectedCluster.podsTemplate" 
              class="code-editor" 
              spellcheck="false">
            </textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showPodsDialog = false">Cancel</button>
          <button class="btn btn-primary" (click)="savePodsTemplate()">Save</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: var(--text-color);
      }
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
      background: #f5f5f5;
      padding: 0.25rem;
      border-radius: 4px;

      .btn {
        padding: 0.5rem;
        background: none;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: #666;

        &:hover {
          background: #e0e0e0;
        }

        &.active {
          background: white;
          color: #2196F3;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      }
    }

    .cluster-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }

    .cluster-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-color);
      }
    }

    .cluster-type {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;

      &.public {
        background: #2196F3;
        color: white;
      }

      &.private {
        background: #E0E0E0;
        color: #424242;
      }
    }

    .card-content {
      padding: 1.5rem;
    }

    .info-section {
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      margin-bottom: 0.75rem;

      label {
        width: 120px;
        color: #666;
      }

      span {
        color: #333;
      }
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: #E3F2FD;
      color: #1976D2;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }

    .quota-section {
      h3 {
        margin: 0 0 1rem;
        color: #333;
      }
    }

    .quota-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .quota-item {
      text-align: center;
    }

    .quota-header {
      margin-bottom: 1rem;

      .quota-type {
        display: block;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .quota-values {
        color: #666;
        font-size: 0.875rem;
      }
    }

    .circular-progress {
      width: 100px;
      height: 100px;
      margin: 0 auto;
    }

    .circular-chart {
      display: block;
      margin: 0 auto;
      max-width: 100%;
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
      fill: #333;
      font-size: 0.5em;
      text-anchor: middle;
    }

    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
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

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;

      &.show {
        display: flex;
      }
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;

      &.modal-large {
        max-width: 800px;
      }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 1.25rem;
      }
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
      }

      input, select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #E0E0E0;
        border-radius: 4px;
        font-size: 0.875rem;

        &:disabled {
          background: #F5F5F5;
          cursor: not-allowed;
        }
      }
    }

    .multi-select {
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      padding: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;

      &:hover {
        background: #F5F5F5;
      }
    }

    .editor-container {
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      overflow: hidden;
    }

    .code-editor {
      width: 100%;
      height: 400px;
      padding: 1rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      border: none;
      resize: none;
      outline: none;
    }

    .icon-grid::before { content: '⊞'; }
    .icon-table::before { content: '⊟'; }
    .icon-plus::before { content: '+'; }
    .icon-edit::before { content: '✎'; }
    .icon-trash::before { content: '🗑'; }
    .icon-code::before { content: '</>'; }
    .icon-close::before { content: '×'; }
  `]
})
export class ClusterManagementComponent implements OnInit {
  clusters: Cluster[] = [];
  showDialog = false;
  showPodsDialog = false;
  isEditing = false;
  viewMode: 'card' | 'table' = 'card';
  selectedCluster: Cluster = this.createEmptyCluster();
  clusterTypes = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' }
  ];
  availableProjects = [
    { label: 'Project A', value: 'Project A' },
    { label: 'Project B', value: 'Project B' },
    { label: 'Project C', value: 'Project C' },
    { label: 'Project D', value: 'Project D' },
    { label: 'Project E', value: 'Project E' }
  ];

  constructor() {}

  ngOnInit() {
    this.loadClusters();
  }

  loadClusters() {
    this.clusters = [
      {
        id: '1',
        name: 'Public Cluster 1',
        namespace: 'default',
        type: 'public',
        createdBy: 'System',
        assignedProjects: ['Project A', 'Project B'],
        reservedCPU: 4,
        podsTemplate: JSON.stringify({
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'example-pod',
            namespace: 'default'
          },
          spec: {
            containers: [{
              name: 'nginx',
              image: 'nginx:latest',
              ports: [{
                containerPort: 80
              }]
            }]
          }
        }, null, 2),
        resourceQuota: [
          { type: 'Limit CPU', used: 8, max: 16, capacity: 50 },
          { type: 'Pods', used: 20, max: 50, capacity: 40 },
          { type: 'Requests CPU', used: 4, max: 8, capacity: 50 }
        ]
      },
      {
        id: '2',
        name: 'Private Cluster 1',
        namespace: 'custom',
        type: 'private',
        createdBy: 'John Doe',
        assignedProjects: ['Project C'],
        reservedCPU: 8,
        podsTemplate: JSON.stringify({
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'custom-pod',
            namespace: 'custom'
          },
          spec: {
            containers: [{
              name: 'custom-app',
              image: 'custom-app:latest',
              resources: {
                requests: {
                  cpu: '500m',
                  memory: '512Mi'
                },
                limits: {
                  cpu: '1000m',
                  memory: '1Gi'
                }
              }
            }]
          }
        }, null, 2),
        resourceQuota: [
          { type: 'Limit CPU', used: 16, max: 32, capacity: 50 },
          { type: 'Pods', used: 40, max: 100, capacity: 40 },
          { type: 'Requests CPU', used: 8, max: 16, capacity: 50 }
        ]
      },
      {
        id: '3',
        name: 'Public Cluster 2',
        namespace: 'default',
        type: 'public',
        createdBy: 'System',
        assignedProjects: ['Project D', 'Project E'],
        reservedCPU: 16,
        podsTemplate: JSON.stringify({
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'high-performance-pod',
            namespace: 'default'
          },
          spec: {
            containers: [{
              name: 'high-perf-app',
              image: 'high-perf-app:latest',
              resources: {
                requests: {
                  cpu: '2000m',
                  memory: '4Gi'
                },
                limits: {
                  cpu: '4000m',
                  memory: '8Gi'
                }
              }
            }]
          }
        }, null, 2),
        resourceQuota: [
          { type: 'Limit CPU', used: 32, max: 64, capacity: 50 },
          { type: 'Pods', used: 80, max: 200, capacity: 40 },
          { type: 'Requests CPU', used: 16, max: 32, capacity: 50 }
        ]
      }
    ];
  }

  createEmptyCluster(): Cluster {
    return {
      id: '',
      name: '',
      namespace: '',
      type: 'private',
      createdBy: '',
      assignedProjects: [],
      reservedCPU: 0,
      podsTemplate: '',
      resourceQuota: [
        { type: 'Limit CPU', used: 0, max: 0, capacity: 0 },
        { type: 'Pods', used: 0, max: 0, capacity: 0 },
        { type: 'Requests CPU', used: 0, max: 0, capacity: 0 }
      ]
    };
  }

  showAddDialog() {
    this.isEditing = false;
    this.selectedCluster = this.createEmptyCluster();
    this.showDialog = true;
  }

  editCluster(cluster: Cluster) {
    this.isEditing = true;
    this.selectedCluster = { ...cluster };
    this.showDialog = true;
  }

  deleteCluster(cluster: Cluster) {
    // Implement delete logic
  }

  toggleProject(project: string) {
    const index = this.selectedCluster.assignedProjects.indexOf(project);
    if (index === -1) {
      this.selectedCluster.assignedProjects.push(project);
    } else {
      this.selectedCluster.assignedProjects.splice(index, 1);
    }
  }

  saveCluster() {
    if (this.isEditing) {
      const index = this.clusters.findIndex(c => c.id === this.selectedCluster.id);
      if (index !== -1) {
        this.clusters[index] = { ...this.selectedCluster };
      }
    } else {
      this.selectedCluster.id = (this.clusters.length + 1).toString();
      this.clusters.push({ ...this.selectedCluster });
    }
    this.showDialog = false;
  }

  viewPodsTemplate(cluster: Cluster) {
    this.selectedCluster = { ...cluster };
    this.showPodsDialog = true;
  }

  savePodsTemplate() {
    const index = this.clusters.findIndex(c => c.id === this.selectedCluster.id);
    if (index !== -1) {
      this.clusters[index].podsTemplate = this.selectedCluster.podsTemplate;
    }
    this.showPodsDialog = false;
  }
} 