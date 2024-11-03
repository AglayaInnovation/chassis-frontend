export const htmlTailwindCss = (name) =>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link href="./css/tailwind.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center text-blue-600">${name}</h1>
        <p class="mt-4 text-center text-gray-700">Welcome to your new project!</p>
    </div>
</body>
</html>
  `
export const html = (name) =>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link href="./css/tailwind.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center text-blue-600">${name}</h1>
        <p class="mt-4 text-center text-gray-700">Welcome to your new react project!</p>
    </div>
</body>
<script src="./index.js"></script>
</html>
  `
