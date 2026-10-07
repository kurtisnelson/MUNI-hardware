function run(input) {
  try {
    const now = Date.now();
    const groups = Array.isArray(input && input.data) ? input.data : [];

    const dirLabel = function (raw) {
      const d = String(raw || "").toUpperCase();
      if (d === "IB") return "Inbound";
      if (d === "OB") return "Outbound";
      return d;
    };

    const routes = groups.map(function (g) {
      const departures = (Array.isArray(g.departures) ? g.departures : [])
        .map(function (d) {
          const iso = d.expected_time || d.aimed_time || "";
          const t = Date.parse(iso);
          const minutes = isNaN(t) ? null : Math.floor((t - now) / 60000);

          let label;
          if (minutes === null) label = "--";
          else if (minutes <= 0) label = "Due";
          else label = String(minutes);

          return {
            label: label,
            minutes: minutes,
            destination: d.destination || "",
            stop_code: d.stop_code || ""
          };
        })
        .sort(function (a, b) {
          if (a.minutes === null) return 1;
          if (b.minutes === null) return -1;
          return a.minutes - b.minutes;
        });

      return {
        route: g.route || "?",
        direction: dirLabel(g.direction),
        destination: departures.length ? departures[0].destination : "",
        stop_code: departures.length ? departures[0].stop_code : "",
        departures: departures,
        times_text: departures.map(function (d) { return d.label; }).join(", ")
      };
    });

    return {
      routes: routes,
      updated_at: new Date(now).toISOString()
    };
  } catch (e) {
    return input;
  }
}
