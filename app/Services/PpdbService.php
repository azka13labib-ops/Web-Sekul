<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\RegistrationDocument;
use Illuminate\Support\Str;

class PpdbService
{
    public function submitRegistration(array $data, $user)
    {
        $existing = Registration::where('user_id', $user->id)->first();
        if ($existing) {
            throw new \Exception('Anda sudah melakukan pendaftaran.');
        }

        $registrationNumber = 'PPDB-' . date('Y') . '-' . strtoupper(Str::random(6));

        $registrationData = [
            'user_id' => $user->id,
            'registration_number' => $registrationNumber,
            'full_name' => $data['full_name'],
            'nisn' => $data['nisn'],
            'date_of_birth' => $data['date_of_birth'],
            'gender' => $data['gender'],
            'address' => $data['address'],
            'previous_school' => $data['previous_school'],
            'major_choice' => $data['major_choice'] ?? 'Fase E (Umum)',
            'status' => 'pending'
        ];

        return Registration::create($registrationData);
    }

    public function uploadDocument(array $data, $user, $file)
    {
        $registration = Registration::where('user_id', $user->id)->first();
        if (!$registration) {
            throw new \Exception('Data pendaftaran tidak ditemukan.');
        }

        $path = $file->store('ppdb/documents/' . $registration->registration_number, 'public');

        return RegistrationDocument::updateOrCreate(
            ['registration_id' => $registration->id, 'document_type' => $data['document_type']],
            ['file_path' => $path]
        );
    }
}
