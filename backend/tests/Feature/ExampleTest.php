<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_root_redirects_to_dashboard(): void
    {
        $this->get('/')->assertRedirect(route('dashboard'));
    }

    public function test_login_page_renders(): void
    {
        $this->get('/login')->assertOk()->assertSee('Se connecter');
    }
}
