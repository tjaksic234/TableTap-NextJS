
export default function DashboardPage() {
    return (
      <div className="flex min-h-screen flex-col space-y-6 p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard.
          </p>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="mt-2 text-2xl font-bold">1,234</p>
          </div>
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Revenue</h3>
            <p className="mt-2 text-2xl font-bold">$12,345</p>
          </div>
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Active Users</h3>
            <p className="mt-2 text-2xl font-bold">543</p>
          </div>
        </div>
  
        {/* Recent Activity */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="rounded-lg border">
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="p-4">
                  <p className="text-sm">Activity Item {item}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }