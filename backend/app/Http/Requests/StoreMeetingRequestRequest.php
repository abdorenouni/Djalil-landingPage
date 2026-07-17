<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** Public visitor form — no auth; abuse is contained by throttling. */
class StoreMeetingRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:254'],
            'phone' => ['required', 'string', 'min:6', 'max:30', 'regex:/^[0-9+\s().-]+$/'],
            'company' => ['nullable', 'string', 'max:120'],
            'preferred_date' => ['required', 'date', 'after_or_equal:today', 'before:+6 months'],
            'preferred_time' => ['required', 'date_format:H:i'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'full_name' => 'nom complet',
            'email' => 'email',
            'phone' => 'téléphone',
            'company' => 'société',
            'preferred_date' => 'date souhaitée',
            'preferred_time' => 'heure souhaitée',
            'message' => 'message',
        ];
    }
}
