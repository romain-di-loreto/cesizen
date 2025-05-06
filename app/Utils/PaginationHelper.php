<?php

namespace App\Utils;

use Illuminate\Pagination\LengthAwarePaginator;

class PaginationHelper
{
    const DEFAULT_PAGE = 1;
    const DEFAULT_COUNT = 10;

    public static function format(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'data' => $paginator->items(),
        ];
    }
}
