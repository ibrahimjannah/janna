<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SalesController extends Controller
{
    /**
     * Display sales analytics
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'week');

        $salesData = $this->getSalesData($period);
        $bestSelling = $this->getBestSellingItems($period);
        $revenueByType = $this->getRevenueByOrderType($period);
        $peakHours = $this->getPeakHours($period);

        // Calculate aggregate stats
        $stats = [
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'total_orders' => Order::count(),
            'avg_order_value' => Order::where('payment_status', 'paid')->avg('total') ?? 0,
            'active_tables' => \App\Models\Table::where('status', 'occupied')->count(),
        ];

        // Format salesData for the bar chart
        $daily_sales = $salesData->map(function($item) {
            return [
                'date' => $item->period,
                'revenue' => (float)$item->total_sales,
                'orders' => $item->order_count
            ];
        });

        // Format top_items
        $top_items = $bestSelling->map(function($item) {
            return [
                'menu_name' => $item->menu->name,
                'total_quantity' => $item->total_quantity,
                'total_revenue' => (float)$item->total_revenue
            ];
        });

        // Format revenue_by_type
        $revenue_by_type = $revenueByType->map(function($item) {
            return [
                'order_type' => $item->order_type,
                'revenue' => (float)$item->total_revenue,
                'order_count' => $item->order_count
            ];
        });

        return Inertia::render('Admin/Sales/Index', [
            'stats' => $stats,
            'daily_sales' => $daily_sales,
            'top_items' => $top_items,
            'revenue_by_type' => $revenue_by_type,
            'peakHours' => $peakHours,
            'period' => $period
        ]);
    }

    /**
     * Get sales data for charts
     */
    /**
     * Get sales data for charts
     */
    private function getSalesData($period)
    {
        $query = Order::where('payment_status', 'paid');

        switch ($period) {
            case 'day':
                $startDate = now()->startOfDay();
                $query->where('created_at', '>=', $startDate);
                $groupBy = 'hour';
                break;
            case 'week':
                $startDate = now()->startOfWeek();
                $query->where('created_at', '>=', $startDate);
                $groupBy = 'day';
                break;
            case 'month':
                $startDate = now()->startOfMonth();
                $query->where('created_at', '>=', $startDate);
                $groupBy = 'day';
                break;
            case 'year':
                $startDate = now()->startOfYear();
                $query->where('created_at', '>=', $startDate);
                $groupBy = 'month';
                break;
            default:
                $startDate = now()->startOfWeek();
                $query->where('created_at', '>=', $startDate);
                $groupBy = 'day';
        }

        // SQLite compatible date formatting
        $sales = $query->selectRaw("
            strftime('" . $this->getDateFormat($groupBy) . "', created_at) as period,
            SUM(total) as total_sales,
            COUNT(*) as order_count
        ")
        ->groupBy('period')
        ->orderBy('period')
        ->get();

        return $sales;
    }

    /**
     * Get best selling items
     */
    private function getBestSellingItems($period)
    {
        $startDate = $this->getStartDate($period);

        $bestSelling = OrderItem::with('menu')
            ->whereHas('order', function($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate)
                      ->where('payment_status', 'paid');
            })
            ->selectRaw('menu_id, SUM(quantity) as total_quantity, SUM(subtotal) as total_revenue')
            ->groupBy('menu_id')
            ->orderBy('total_quantity', 'desc')
            ->limit(10)
            ->get();

        return $bestSelling;
    }

    /**
     * Get revenue by order type
     */
    private function getRevenueByOrderType($period)
    {
        $startDate = $this->getStartDate($period);

        $revenue = Order::where('created_at', '>=', $startDate)
            ->where('payment_status', 'paid')
            ->selectRaw('order_type, SUM(total) as total_revenue, COUNT(*) as order_count')
            ->groupBy('order_type')
            ->get();

        return $revenue;
    }

    /**
     * Get peak hours analysis
     */
    private function getPeakHours($period)
    {
        $startDate = $this->getStartDate($period);

        // SQLite extraction of hour
        $peakHours = Order::where('created_at', '>=', $startDate)
            ->where('payment_status', 'paid')
            ->selectRaw("CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as order_count, SUM(total) as total_sales")
            ->groupBy('hour')
            ->orderBy('order_count', 'desc')
            ->get();

        return $peakHours;
    }

    /**
     * Get date format for SQL grouping (SQLite compatible)
     */
    private function getDateFormat($groupBy)
    {
        switch ($groupBy) {
            case 'hour':
                return '%Y-%m-%d %H:00';
            case 'day':
                return '%Y-%m-%d';
            case 'month':
                return '%Y-%m';
            default:
                return '%Y-%m-%d';
        }
    }

    /**
     * Get start date based on period
     */
    private function getStartDate($period)
    {
        switch ($period) {
            case 'day':
                return now()->startOfDay();
            case 'week':
                return now()->startOfWeek();
            case 'month':
                return now()->startOfMonth();
            case 'year':
                return now()->startOfYear();
            default:
                return now()->startOfWeek();
        }
    }
}
