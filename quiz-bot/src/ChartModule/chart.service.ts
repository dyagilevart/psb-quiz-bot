import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfig } from './types/chartConfig.type';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class ChartService {
  private canvasRenderService: ChartJSNodeCanvas;

  constructor() {
    this.canvasRenderService = new ChartJSNodeCanvas({
      height: 600,
      width: 800,
    });
  }

  async generateStatistic(
    values: number[],
    config: ChartConfig = {},
  ): Promise<Buffer> {
    const {
      backgroundColor = '#ffffff',
      colorScheme = ['#4facfe', '#00f2fe', '#ff6b6b', '#51cf66', '#ffd43b'],
      showValues = true,
      title = 'Bar Chart',
    } = config;

    const configuration: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: values.map((_, index) => `${index + 1}`),
        datasets: [{
          label: 'Values',
          data: values,
          backgroundColor: colorScheme,
          borderColor: colorScheme.map(color => color.replace('0.2', '1')),
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 0 // Отключаем анимацию для серверного рендеринга
        }
      }
    };

    return await this.canvasRenderService.renderToBuffer(configuration);
  }
}
