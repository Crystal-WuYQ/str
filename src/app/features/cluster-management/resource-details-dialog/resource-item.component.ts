import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resource-item">
      <h3>{{ title }}</h3>
      <div class="circular-progress">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path class="circle"
            [style.strokeDasharray]="percentage + ', 100'"
            [class.warning]="percentage >= 70"
            [class.danger]="percentage >= 90"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage">{{ percentage | number:'1.0-1' }}%</text>
        </svg>
      </div>
      <div class="usage-details">
        <div class="usage-row">
          <span class="label">Used:</span>
          <span class="value">{{ used | number:'1.0-2' }} {{ unit }}</span>
        </div>
        <div class="usage-row">
          <span class="label">Max:</span>
          <span class="value">{{ max | number:'1.0-2' }} {{ unit }}</span>
        </div>
        <div class="usage-row">
          <span class="label">Available:</span>
          <span class="value">{{ max - used | number:'1.0-2' }} {{ unit }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resource-item {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .resource-item h3 {
      margin: 0 0 1rem;
      color: #333;
    }

    .circular-progress {
      width: 120px;
      height: 120px;
      margin: 0 auto 1rem;
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

    .circle.warning {
      stroke: #FFA726;
    }

    .circle.danger {
      stroke: #F44336;
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

    .usage-details {
      color: #666;
      font-size: 0.875rem;
      margin-top: 1rem;
    }

    .usage-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      padding: 0.25rem 0;
    }

    .usage-row:last-child {
      margin-bottom: 0;
      border-top: 1px solid #ddd;
      padding-top: 0.5rem;
      margin-top: 0.5rem;
    }

    .label {
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .icon-details::before { content: '📊'; }
  `]
})
export class ResourceItemComponent {
  @Input() title!: string;
  @Input() used!: number;
  @Input() max!: number;
  @Input() unit!: string;

  get percentage(): number {
    return (this.used / this.max) * 100;
  }
} 