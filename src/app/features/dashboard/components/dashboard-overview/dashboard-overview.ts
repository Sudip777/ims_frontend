import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { IconFieldModule } from 'primeng/iconfield';
import { IconComponent } from '../../../../shared/icons/components/icon.component';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MetricCardComponent } from '../../../../shared/components/metric-card/metric-card';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    DatePickerModule,
    MetricCardComponent,
    ChartModule,
    ButtonModule
],
  templateUrl: './dashboard-overview.html',
  styleUrls: ['./dashboard-overview.scss'],
})
export class DashboardOverview implements OnInit {
  timePeriods = ['1d', '7d', '1m', '3m', '6m', '1y'];
  selectedPeriod = '1m';
  date: Date | null = null;
  sidebarOpen = false;

  // Chart Data
  stackedBarData: any;
  stackedBarOptions: any;

  doughnutData: any;
  doughnutOptions: any;

  pieData: any;
  pieOptions: any;

  normalBarData: any;
  normalBarOptions: any;

  ngOnInit() {
    /* ============================
       📦 1️⃣ INVENTORY STOCK LEVELS (Stacked Bar)
       ============================ */
    this.stackedBarData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'In Stock',
          data: [120, 150, 130, 180, 200, 220, 240],
          backgroundColor: '#10B981', // Tailwind Green
        },
        {
          label: 'Reserved',
          data: [40, 60, 55, 70, 80, 75, 90],
          backgroundColor: '#3B82F6', // Tailwind Blue
        },
        {
          label: 'Out of Stock',
          data: [20, 15, 25, 10, 8, 12, 7],
          backgroundColor: '#EF4444', // Tailwind Red
        },
      ],
    };

    this.stackedBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#6B7280',
            font: { size: 13 },
          },
        },
        title: {
          display: true,
          text: 'Inventory Status (Stacked by Month)',
          color: '#111827',
          font: { size: 16, weight: '600' },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#6B7280' },
          grid: { display: false },
        },
        y: {
          stacked: true,
          ticks: { color: '#6B7280' },
          grid: { color: '#E5E7EB' },
        },
      },
    };

    /* ============================
       🧁 2️⃣ CATEGORY DISTRIBUTION (Doughnut)
       ============================ */
    this.doughnutData = {
      labels: ['Electronics', 'Clothing', 'Furniture', 'Groceries', 'Toys'],
      datasets: [
        {
          data: [350, 250, 200, 150, 100],
          backgroundColor: [
            '#3B82F6', // Blue
            '#10B981', // Green
            '#F59E0B', // Amber
            '#6366F1', // Indigo
            '#EF4444', // Red
          ],
          hoverBackgroundColor: ['#2563EB', '#059669', '#D97706', '#4F46E5', '#DC2626'],
          borderWidth: 0,
        },
      ],
    };

    this.doughnutOptions = {
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#6B7280',
            font: { size: 13 },
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Stock Distribution by Category',
          color: '#111827',
          font: { size: 16, weight: '600' },
        },
      },
    };

    /* ============================
       🥧 3️⃣ SUPPLIER CONTRIBUTION (Pie)
       ============================ */
    this.pieData = {
      labels: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [
            '#F59E0B', // Amber
            '#10B981', // Green
            '#3B82F6', // Blue
            '#EF4444', // Red
          ],
          hoverBackgroundColor: ['#D97706', '#059669', '#2563EB', '#DC2626'],
        },
      ],
    };

    this.pieOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#6B7280',
            font: { size: 13 },
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Supplier Contribution (%)',
          color: '#111827',
          font: { size: 16, weight: '600' },
        },
      },
    };

    /* ============================
       📊 4️⃣ MONTHLY SALES TREND (Normal Bar)
       ============================ */
    this.normalBarData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Sales (Units)',
          data: [400, 480, 450, 520, 580, 620, 700],
          backgroundColor: '#3B82F6',
          borderRadius: 6,
        },
      ],
    };

    this.normalBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Monthly Sales Trend',
          color: '#111827',
          font: { size: 16, weight: '600' },
        },
      },
      scales: {
        x: {
          ticks: { color: '#6B7280' },
          grid: { display: false },
        },
        y: {
          ticks: { color: '#6B7280' },
          grid: { color: '#E5E7EB' },
        },
      },
    };
  }
}
