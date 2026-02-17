export default function CountryPage({ params }: { params: { country: string } }) {
    const { country } = params;

    let countryName = '';

    if (country === 'in') {
        countryName = 'India';
    } else if (country === 'ae') {
        countryName = 'Abu Dhabi (UAE)';
    } else if (country === 'us') {
        countryName = 'USA';
    } else {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-24">
                <h1 className="text-4xl font-bold">404 - Country Not Found</h1>
                <p className="mt-4 text-xl">We do not currently serve this region.</p>
                <a href="/" className="mt-8 text-blue-500 hover:underline">Go back to Verify Human page</a>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-24 font-sans">
            <header className="w-full flex justify-between items-center mb-12">
                <div className="text-2xl font-bold">Brand Logo</div>
                <nav className="flex gap-4">
                    <a href="#" className="hover:underline">Home</a>
                    <a href="#" className="hover:underline">Products</a>
                    <a href="#" className="hover:underline">About</a>
                    <a href="#" className="hover:underline">Contact</a>
                </nav>
            </header>

            <main className="flex flex-col items-center text-center">
                <h1 className="text-6xl font-bold mb-6">Welcome to {countryName}</h1>
                <p className="text-xl max-w-2xl text-gray-600">
                    Experiencing premium quality directly in {countryName}.
                </p>

                <div className="mt-12 bg-gray-100 p-8 rounded-xl w-full max-w-4xl min-h-[400px] flex items-center justify-center">
                    <p className="text-gray-400">Content specific to {countryName} will appear here.</p>
                </div>
            </main>

            <footer className="mt-24 w-full border-t p-8 text-center text-gray-500">
                &copy; {new Date().getFullYear()} Multi-Country Site. All rights reserved.
            </footer>
        </div>
    );
}
