<?php
$ratesFile1 = __DIR__ . '/../dist/rates.json';

// Create dist directory if it doesn't exist
if (!is_dir(__DIR__ . '/../dist')) {
    mkdir(__DIR__ . '/../dist', 0755, true);
}
$ratesFile2 = __DIR__ . '/../public/rates.json';

// Create dist directory if it doesn't exist
if (!is_dir(__DIR__ . '/../public')) {
    mkdir(__DIR__ . '/../public', 0755, true);
}

function update($ratesFile) {
	$today = date('Y-m-d');

	// Check if we need to update rates (if file doesn't exist or is from yesterday)
	$needsUpdate = true;
	if (file_exists($ratesFile)) {
		$data = json_decode(file_get_contents($ratesFile), true);
		if ($data && isset($data['date']) && $data['date'] === $today) {
			$needsUpdate = false;
		}
	}

	if ($needsUpdate) {
		// Fetch new rates from Frankfurter API
		$response = file_get_contents('https://api.frankfurter.app/latest?from=USD');
		if ($response) {
			$rates = json_decode($response, true);
			$rates['date'] = $today;
			file_put_contents($ratesFile, json_encode($rates));
			echo "Exchange rates updated successfully.\n";
		} else {
			// If API call fails, return old rates if available
			if (file_exists($ratesFile)) {
				echo "API call failed. Using existing rates.\n";
			} else {
				echo "Failed to fetch exchange rates and no existing rates found.\n";
				exit(1);
			}
		}
	} else {
		echo "Exchange rates are already up to date.\n";
	}
}

update($ratesFile1);
update($ratesFile2);