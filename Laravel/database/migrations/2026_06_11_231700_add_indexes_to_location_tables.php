<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('countries', function (Blueprint $table) {
            $table->index('name');
            $table->index('iso2');
            $table->index('iso3');
        });

        Schema::table('states', function (Blueprint $table) {
            $table->index('name');
            $table->index('country_id');
        });

        Schema::table('cities', function (Blueprint $table) {
            $table->index('name');
            $table->index('state_id');
            $table->index('country_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('countries', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['iso2']);
            $table->dropIndex(['iso3']);
        });

        Schema::table('states', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['country_id']);
        });

        Schema::table('cities', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['state_id']);
            $table->dropIndex(['country_id']);
        });
    }
};
