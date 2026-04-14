import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

export default function SystemActivity() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast, showToast } = useToast();

  const fetchActivity = useCallback(async () => {

    try {

      /* ONLY ORDERS ACTIVITY FOR ADMIN */

      const ordersRes = await api.get("/orders/admin");

      const orderEvents = ordersRes.data.map((o) => ({
        type: "order",
        message: `Order placed for service "${o.service?.name || "Unknown"}"`,
        actor: o.user?.email || "User",
        time: o.createdAt,
      }));

      const sorted = orderEvents.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );

      setActivities(sorted);

    } catch (err) {

      console.error("SYSTEM ACTIVITY ERROR", err);
      showToast("Failed to load system activity", "error");

    } finally {

      setLoading(false);

    }

  }, [showToast]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const orderCount = activities.filter(a => a.type === "order").length;

  const badge = () => "bg-green-100 text-green-700";

  const icon = () => "🛒";

  return (

    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 space-y-8">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            📡 System Activity Center
          </h1>

          <p className="text-gray-500 mt-1">
            Real-time monitoring of platform order activity
          </p>
        </div>

        {/* TOP STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatCard
            title="Total Events"
            value={activities.length}
          />

          <StatCard
            title="Order Events"
            value={orderCount}
            highlight
          />

          <StatCard
            title="Security Logs"
            value="SuperAdmin Only"
          />

        </div>

        {/* ACTIVITY FEED */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Live Activity Feed
          </h2>

          {loading ? (

            <p className="text-center py-10 text-gray-500">
              Loading system activity...
            </p>

          ) : activities.length === 0 ? (

            <p className="text-center py-10 text-gray-500">
              No activity detected
            </p>

          ) : (

            <div className="space-y-4">

              {activities.map((a, i) => (

                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-xl hover:bg-gray-50 transition"
                >

                  {/* ICON */}

                  <div className="text-xl">
                    {icon()}
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-1">

                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${badge()}`}
                      >
                        ORDER
                      </span>

                    </div>

                    <p className="text-sm text-gray-800">
                      <b>{a.actor}</b> — {a.message}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(a.time).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </>
  );
}


/* ---------- COMPONENT ---------- */

function StatCard({ title, value, highlight }) {

  return (

    <div
      className={`bg-white p-6 rounded-2xl shadow ${
        highlight ? "border-2 border-blue-500" : ""
      }`}
    >

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

    </div>

  );

}