<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900">Size Guide</h1>
        <p class="text-gray-600 mt-2">Find your perfect fit with our sizing charts</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">How to Measure</h2>
          <p class="text-gray-600 mb-4">
            For the most accurate measurements, have someone else measure you while wearing form-fitting clothing.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Women's Sizing -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Women's Clothing</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2">Size</th>
                    <th class="text-left py-2">Bust (cm)</th>
                    <th class="text-left py-2">Waist (cm)</th>
                    <th class="text-left py-2">Hip (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2">XS</td>
                    <td class="py-2">82-86</td>
                    <td class="py-2">62-66</td>
                    <td class="py-2">87-91</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">S</td>
                    <td class="py-2">87-91</td>
                    <td class="py-2">67-71</td>
                    <td class="py-2">92-96</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">M</td>
                    <td class="py-2">92-96</td>
                    <td class="py-2">72-76</td>
                    <td class="py-2">97-101</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">L</td>
                    <td class="py-2">97-102</td>
                    <td class="py-2">77-82</td>
                    <td class="py-2">102-107</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">XL</td>
                    <td class="py-2">103-108</td>
                    <td class="py-2">83-88</td>
                    <td class="py-2">108-113</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Men's Sizing -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Men's Clothing</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2">Size</th>
                    <th class="text-left py-2">Chest (cm)</th>
                    <th class="text-left py-2">Waist (cm)</th>
                    <th class="text-left py-2">Hip (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2">XS</td>
                    <td class="py-2">86-91</td>
                    <td class="py-2">71-76</td>
                    <td class="py-2">86-91</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">S</td>
                    <td class="py-2">92-97</td>
                    <td class="py-2">77-82</td>
                    <td class="py-2">92-97</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">M</td>
                    <td class="py-2">98-103</td>
                    <td class="py-2">83-88</td>
                    <td class="py-2">98-103</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">L</td>
                    <td class="py-2">104-109</td>
                    <td class="py-2">89-94</td>
                    <td class="py-2">104-109</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">XL</td>
                    <td class="py-2">110-117</td>
                    <td class="py-2">95-102</td>
                    <td class="py-2">110-117</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Measurement Tips -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Measurement Tips</h3>
          <ul class="space-y-2 text-gray-600">
            <li>• <strong>Bust/Chest:</strong> Measure around the fullest part of your bust/chest</li>
            <li>• <strong>Waist:</strong> Measure around the narrowest part of your waistline</li>
            <li>• <strong>Hip:</strong> Measure around the fullest part of your hips</li>
            <li>• <strong>Length:</strong> Measure from shoulder to desired length</li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Still unsure about sizing? Contact us at 
            <a href="mailto:info@mvintage.com" class="text-blue-600 hover:underline">info@mvintage.com</a>
            for personalized assistance.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple size guide component with static content
</script>