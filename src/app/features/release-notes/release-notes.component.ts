import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

interface ReleaseNote {
  version: string;
  date: string;
  features: string[];
  improvements: string[];
  bugFixes: string[];
  knownIssues: string[];
  comingSoon: string[];
}

@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, TimelineModule],
  template: `
    <div class="release-notes">
      <div class="header">
        <h1>Release Notes</h1>
        <p class="subtitle">Stay updated with our latest features and improvements</p>
      </div>

      <div class="version-list">
        <p-timeline [value]="releases">
          <ng-template pTemplate="content" let-release>
            <div class="version-card">
              <div class="version-header">
                <h2>Version {{release.version}}</h2>
                <p class="date">{{release.date}}</p>
              </div>

              <div class="version-content">
                @if (release.features.length) {
                  <div class="section">
                    <h3>
                      <i class="pi pi-star-fill"></i>
                      New Features
                    </h3>
                    <ul>
                      @for (feature of release.features; track feature) {
                        <li>{{feature}}</li>
                      }
                    </ul>
                  </div>
                }

                @if (release.improvements.length) {
                  <div class="section">
                    <h3>
                      <i class="pi pi-arrow-up"></i>
                      Improvements
                    </h3>
                    <ul>
                      @for (improvement of release.improvements; track improvement) {
                        <li>{{improvement}}</li>
                      }
                    </ul>
                  </div>
                }

                @if (release.bugFixes.length) {
                  <div class="section">
                    <h3>
                      <i class="pi pi-bug"></i>
                      Bug Fixes
                    </h3>
                    <ul>
                      @for (fix of release.bugFixes; track fix) {
                        <li>{{fix}}</li>
                      }
                    </ul>
                  </div>
                }

                @if (release.knownIssues.length) {
                  <div class="section">
                    <h3>
                      <i class="pi pi-exclamation-triangle"></i>
                      Known Issues
                    </h3>
                    <ul>
                      @for (issue of release.knownIssues; track issue) {
                        <li>{{issue}}</li>
                      }
                    </ul>
                  </div>
                }

                @if (release.comingSoon.length) {
                  <div class="section">
                    <h3>
                      <i class="pi pi-clock"></i>
                      Coming Soon
                    </h3>
                    <ul>
                      @for (item of release.comingSoon; track item) {
                        <li>{{item}}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </div>
          </ng-template>
        </p-timeline>
      </div>
    </div>
  `,
  styles: [`
    .release-notes {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        color: var(--text-color);
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: var(--text-color-secondary);
        font-size: 1.1rem;
      }
    }

    .version-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 2rem;
      margin: 1rem 0;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .version-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--surface-border);

      h2 {
        font-size: 1.5rem;
        color: var(--primary-color);
        margin: 0;
      }

      .date {
        color: var(--text-color-secondary);
        margin: 0.5rem 0 0;
      }
    }

    .version-content {
      .section {
        margin-bottom: 1.5rem;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          color: var(--text-color);
          margin-bottom: 1rem;

          i {
            color: var(--primary-color);
          }
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 0.5rem 0;
            color: var(--text-color);
            position: relative;
            padding-left: 1.5rem;

            &:before {
              content: "•";
              color: var(--primary-color);
              position: absolute;
              left: 0;
            }
          }
        }
      }
    }

    :host ::ng-deep {
      .p-timeline-event-content {
        background: transparent !important;
        box-shadow: none !important;
      }

      .p-timeline-event-opposite {
        display: none !important;
      }

      .p-timeline-event-connector {
        background-color: var(--surface-border) !important;
      }

      .p-timeline-event-marker {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
      }
    }
  `]
})
export class ReleaseNotesComponent {
  releases: ReleaseNote[] = [
    {
      version: '2.0.0',
      date: 'March 15, 2024',
      features: [
        'New AI-powered test analysis feature',
        'Enhanced test execution dashboard',
        'Improved test case management'
      ],
      improvements: [
        'Faster test execution speed',
        'Better error reporting',
        'Enhanced UI/UX'
      ],
      bugFixes: [
        'Fixed test execution timeout issues',
        'Resolved report generation errors',
        'Fixed UI rendering issues'
      ],
      knownIssues: [
        'Some browsers may show rendering issues',
        'Performance degradation with large test suites'
      ],
      comingSoon: [
        'Real-time test execution monitoring',
        'Advanced test analytics',
        'Integration with CI/CD pipelines'
      ]
    },
    {
      version: '1.9.0',
      date: 'February 28, 2024',
      features: [
        'New test suite management',
        'Enhanced reporting features'
      ],
      improvements: [
        'Improved test execution speed',
        'Better error handling'
      ],
      bugFixes: [
        'Fixed login issues',
        'Resolved report generation problems'
      ],
      knownIssues: [],
      comingSoon: [
        'AI-powered test analysis',
        'Advanced analytics dashboard'
      ]
    }
  ];
} 