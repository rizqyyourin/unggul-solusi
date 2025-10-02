<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Custom helper command: migrate fresh + seed in one go
Artisan::command('db:refresh-seed', function () {
    $this->info('Running migrate:fresh ...');
    Artisan::call('migrate:fresh', [], $this->getOutput());

    $this->info('Seeding database ...');
    Artisan::call('db:seed', [], $this->getOutput());

    $this->info('Done. Database refreshed and seeded successfully.');
})->purpose('Refresh database and run all seeders');
