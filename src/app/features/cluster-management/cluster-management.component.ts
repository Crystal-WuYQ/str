import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceDetailsDialogComponent } from './resource-details-dialog/resource-details-dialog.component';
import { ProjectsDialogComponent } from './projects-dialog/projects-dialog.component';
import { PodsTemplateDialogComponent } from './pods-template-dialog/pods-template-dialog.component';
import { ClusterFormDialogComponent } from './cluster-form-dialog/cluster-form-dialog.component';

export interface ResourceUsage {
  cpuUsage: number;
  podsUsage: number;
  requestsCpuUsage: number;
}

export interface Cluster {
  name: string;
  namespace: string;
  type: string;
  assignedProjects: string[];
  podsTemplate: string;
  createdTime: string;
  max: {
    limitsCPU: number;
    limitsMemory: number;
    pods: number;
    requestsCPU: number;
    requestsMemory: number;
  };
  used: {
    limitsCPU: number;
    limitsMemory: number;
    pods: number;
    requestsCPU: number;
    requestsMemory: number;
  };
}

@Component({
  selector: 'app-cluster-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ResourceDetailsDialogComponent,
    ProjectsDialogComponent,
    PodsTemplateDialogComponent,
    ClusterFormDialogComponent
  ],
  template: `
    <div class="cluster-management">
      <div class="header">
        <h1>Cluster Management</h1>
        <button class="btn btn-primary" (click)="openAddClusterDialog()">
          Add Cluster
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Namespace</th>
              <th>Type</th>
              <th>Resource Usage</th>
              <th>Projects</th>
              <th>Pods Template</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cluster of clusters">
              <td>{{ cluster.name }}</td>
              <td>{{ cluster.namespace }}</td>
              <td>{{ cluster.type }}</td>
              <td>
                <div class="resource-usage">
                  <div class="usage-item">
                    <span class="label">CPU:</span>
                    <div class="progress-bar">
                      <div class="progress" 
                        [style.width.%]="calculateResourceUsage(cluster).cpuUsage"
                        [class.warning]="calculateResourceUsage(cluster).cpuUsage >= 70"
                        [class.danger]="calculateResourceUsage(cluster).cpuUsage >= 90">
                      </div>
                    </div>
                    <span class="value">{{ calculateResourceUsage(cluster).cpuUsage | number:'1.0-1' }}%</span>
                  </div>
                  <div class="usage-item">
                    <span class="label">Pods:</span>
                    <div class="progress-bar">
                      <div class="progress"
                        [style.width.%]="calculateResourceUsage(cluster).podsUsage"
                        [class.warning]="calculateResourceUsage(cluster).podsUsage >= 70"
                        [class.danger]="calculateResourceUsage(cluster).podsUsage >= 90">
                      </div>
                    </div>
                    <span class="value">{{ calculateResourceUsage(cluster).podsUsage | number:'1.0-1' }}%</span>
                  </div>
                </div>
              </td>
              <td>
                <button class="btn btn-link" (click)="openProjectsDialog(cluster)">
                  {{ cluster.assignedProjects.length }} Projects
                </button>
              </td>
              <td>
                <button class="btn btn-link" (click)="openPodsTemplateDialog(cluster)">
                  View Template
                </button>
              </td>
              <td>
                <div class="actions">
                  <button class="btn btn-icon" (click)="openResourceDetailsDialog(cluster)">
                    <i class="icon-details"></i>
                  </button>
                  <button class="btn btn-icon" (click)="editCluster(cluster)">
                    <i class="icon-edit"></i>
                  </button>
                  <button class="btn btn-icon" (click)="deleteCluster(cluster)">
                    <i class="icon-delete"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-resource-details-dialog
        *ngIf="showResourceDetails && selectedCluster"
        [cluster]="selectedCluster"
        [onClose]="closeResourceDetailsDialog"
      ></app-resource-details-dialog>

      <app-projects-dialog
        *ngIf="showProjectsDialog && selectedCluster"
        [cluster]="selectedCluster"
        [onClose]="closeProjectsDialog"
        [onSave]="saveProjects"
      ></app-projects-dialog>

      <app-pods-template-dialog
        *ngIf="showPodsTemplateDialog && selectedCluster"
        [cluster]="selectedCluster"
        [onClose]="closePodsTemplateDialog"
        [onSave]="savePodsTemplate"
      ></app-pods-template-dialog>

      <app-cluster-form-dialog
        *ngIf="showClusterForm"
        [isEdit]="isEditingCluster"
        [cluster]="selectedCluster!"
        [onClose]="closeClusterForm"
        [onSubmit]="saveCluster"
        [referenceValues]="clusterReferenceValues"
      ></app-cluster-form-dialog>
    </div>
  `,
  styles: [`
    .cluster-management {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .data-table th {
      background: #f5f5f5;
      font-weight: 500;
      color: #666;
    }

    .data-table tr:hover {
      background: #f9f9f9;
    }

    .resource-usage {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .usage-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .label {
      min-width: 40px;
      color: #666;
    }

    .progress-bar {
      flex: 1;
      height: 4px;
      background: #E0E0E0;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: #2196F3;
      transition: width 0.3s ease;
    }

    .progress.warning {
      background: #FFA726;
    }

    .progress.danger {
      background: #F44336;
    }

    .value {
      min-width: 50px;
      text-align: right;
      color: #666;
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
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
    }

    .btn-primary {
      background: #2196F3;
      color: white;
    }

    .btn-primary:hover {
      background: #1976D2;
    }

    .btn-link {
      background: none;
      color: #2196F3;
      padding: 0.25rem 0.5rem;
    }

    .btn-link:hover {
      background: #E3F2FD;
    }

    .btn-icon {
      padding: 0.5rem;
      border-radius: 50%;
      background: none;
    }

    .btn-icon:hover {
      background: #f5f5f5;
    }

    .icon-details::before { content: '📊'; }
    .icon-edit::before { content: '✎'; }
    .icon-delete::before { content: '🗑'; }
  `]
})
export class ClusterManagementComponent implements OnInit {
  clusters: Cluster[] = [];
  selectedCluster: Cluster | null = null;
  showResourceDetails = false;
  showProjectsDialog = false;
  showPodsTemplateDialog = false;
  showClusterForm = false;
  isEditingCluster = false;
  clusterReferenceValues = {
    totalRequestCPU: 100,
    totalLimitCPU: 200,
    totalRequestMemory: 1000,
    totalLimitMemory: 2000
  };

  ngOnInit() {
    // TODO: Load clusters from service
    this.loadClusters();
  }

  loadClusters() {
    // Mock data for testing
    this.clusters = [
      {
        name: 'cluster-1',
        namespace: 'default',
        type: 'Production',
        assignedProjects: ['project-1', 'project-2'],
        podsTemplate: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: example-pod',
        createdTime: '2024-01-01T00:00:00Z',
        max: {
          limitsCPU: 100,
          pods: 1000,
          requestsCPU: 80,
          limitsMemory: 1000,
          requestsMemory: 800
        },
        used: {
          limitsCPU: 60,
          pods: 500,
          requestsCPU: 40,
          limitsMemory: 600,
          requestsMemory: 400
        }
      }
    ];
  }

  calculateResourceUsage(cluster: Cluster): ResourceUsage {
    return {
      cpuUsage: (cluster.used.limitsCPU / cluster.max.limitsCPU) * 100,
      podsUsage: (cluster.used.pods / cluster.max.pods) * 100,
      requestsCpuUsage: (cluster.used.requestsCPU / cluster.max.requestsCPU) * 100
    };
  }

  openResourceDetailsDialog(cluster: Cluster) {
    this.selectedCluster = cluster;
    this.showResourceDetails = true;
  }

  closeResourceDetailsDialog = () => {
    this.showResourceDetails = false;
    this.selectedCluster = null;
  }

  openProjectsDialog(cluster: Cluster) {
    this.selectedCluster = cluster;
    this.showProjectsDialog = true;
  }

  closeProjectsDialog = () => {
    this.showProjectsDialog = false;
    this.selectedCluster = null;
  }

  saveProjects = (projects: string[]) => {
    if (this.selectedCluster) {
      this.selectedCluster.assignedProjects = projects;
      // TODO: Save to backend
    }
  }

  openPodsTemplateDialog(cluster: Cluster) {
    this.selectedCluster = cluster;
    this.showPodsTemplateDialog = true;
  }

  closePodsTemplateDialog = () => {
    this.showPodsTemplateDialog = false;
    this.selectedCluster = null;
  }

  savePodsTemplate = (template: string) => {
    if (this.selectedCluster) {
      this.selectedCluster.podsTemplate = template;
      // TODO: Save to backend
    }
  }

  openAddClusterDialog() {
    this.isEditingCluster = false;
    this.selectedCluster = null;
    this.showClusterForm = true;
  }

  editCluster(cluster: Cluster) {
    this.isEditingCluster = true;
    this.selectedCluster = cluster;
    this.showClusterForm = true;
  }

  closeClusterForm = () => {
    this.showClusterForm = false;
    this.selectedCluster = null;
    this.isEditingCluster = false;
  }

  saveCluster = (formData: any) => {
    if (this.isEditingCluster && this.selectedCluster) {
      // Update existing cluster
      Object.assign(this.selectedCluster, formData);
      // TODO: Call backend API to update cluster
    } else {
      // Create new cluster
      const newCluster: Cluster = {
        ...formData,
        namespace: 'default', // TODO: Get from form or configuration
        assignedProjects: [],
        podsTemplate: '',
        createdTime: new Date().toISOString(),
        max: {
          limitsCPU: this.clusterReferenceValues.totalLimitCPU,
          limitsMemory: this.clusterReferenceValues.totalLimitMemory,
          pods: 1000, // TODO: Get from configuration
          requestsCPU: this.clusterReferenceValues.totalRequestCPU,
          requestsMemory: this.clusterReferenceValues.totalRequestMemory
        },
        used: {
          limitsCPU: 0,
          limitsMemory: 0,
          pods: 0,
          requestsCPU: 0,
          requestsMemory: 0
        }
      };
      this.clusters.push(newCluster);
      // TODO: Call backend API to create cluster
    }
    this.closeClusterForm();
  }

  deleteCluster(cluster: Cluster) {
    // TODO: Implement delete confirmation and backend call
  }
} 