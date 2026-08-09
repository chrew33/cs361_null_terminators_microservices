# Chart Service

'''
Takes chart data in the request and returns a PNG of the chart.

Example body:
{
  "title": "Distance Over Time",
  "x_label": "Seconds",
  "y_label": "Meters",
  "x": [0, 1, 2, 3],
  "y": [0, 4.9, 19.6, 44.1]
}

Run:  python chart-service.py
'''
import io
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


PORT = 5001

DEFAULT_WIDTH = 800
DEFAULT_HEIGHT = 500
DOTS_PER_INCH = 100

BLACK = "#000000"
WHITE = "#ffffff"
GRAY = "#999999"
LIGHT_GRAY = "#cccccc"


def get_points(request):
    if "x" not in request or "y" not in request:
        raise ValueError('Please include "x" and "y", each a list of numbers.')

    x_values = request["x"]
    y_values = request["y"]

    if not isinstance(x_values, list) or not isinstance(y_values, list):
        raise ValueError('"x" and "y" must both be lists of numbers.')

    if len(x_values) != len(y_values):
        raise ValueError(
            f"You gave {len(x_values)} x values but {len(y_values)} y values. "
            "There must be one y for every x."
        )

    if len(x_values) == 0:
        raise ValueError("Please give at least one point to plot.")

    for number in x_values + y_values:
        if not isinstance(number, (int, float)):
            raise ValueError(f"Points must be numbers, but I got: {number!r}")

    return sorted(zip(x_values, y_values))


def make_chart_png(request):
    """Render the request dict to PNG bytes."""
    title = request.get("title", "")
    x_label = request.get("x_label", "")
    y_label = request.get("y_label", "")

    points = get_points(request)
    x_values = [point[0] for point in points]
    y_values = [point[1] for point in points]

    width = request.get("width", DEFAULT_WIDTH)
    height = request.get("height", DEFAULT_HEIGHT)

    picture, chart = plt.subplots(
        figsize=(width / DOTS_PER_INCH, height / DOTS_PER_INCH),
        dpi=DOTS_PER_INCH,
    )
    picture.patch.set_facecolor(WHITE)
    chart.set_facecolor(WHITE)

    try:
        chart.plot(
            x_values,
            y_values,
            color=BLACK,
            linewidth=2,
            marker="o",
            markersize=6,
            markeredgecolor=WHITE, 
            markeredgewidth=1.5,
        )

        chart.set_title(title, color=BLACK, fontsize=14, pad=15)
        chart.set_xlabel(x_label, color=BLACK, fontsize=11, labelpad=10)
        chart.set_ylabel(y_label, color=BLACK, fontsize=11, labelpad=10)

        chart.grid(color=LIGHT_GRAY, linewidth=0.8)
        chart.set_axisbelow(True)

        chart.spines["top"].set_visible(False)  
        chart.spines["right"].set_visible(False)
        chart.spines["left"].set_color(GRAY)
        chart.spines["bottom"].set_color(GRAY)

        chart.tick_params(colors=BLACK, labelsize=10, length=0)

        picture.tight_layout()

        png_file = io.BytesIO()
        picture.savefig(png_file, format="png", facecolor=WHITE)

        return png_file.getvalue()

    finally:
        plt.close(picture)



# Web server


HELP_TEXT = """Chart Service

POST your chart to http://localhost:%d/chart as JSON and you get a PNG back.

Example body:
{
  "title": "Distance Over Time",
  "x_label": "Seconds",
  "y_label": "Meters",
  "x": [0, 1, 2, 3],
  "y": [0, 4.9, 19.6, 44.1]
}
""" % PORT


class ChartHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        if self.path != "/chart":
            self.send_json({"error": "Unknown address. Please POST to /chart."}, 404)
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            request = json.loads(body)
        except ValueError:
            self.send_json({"error": "The body of your request was not valid JSON."}, 400)
            return


        print(f'--> REQUEST  /chart  "{request.get("title", "")}"')
        print(f'             x {request.get("x")}')
        print(f'             y {request.get("y")}')


        try:
            png = make_chart_png(request)
        except ValueError as error:
            print("<-- RESPONSE 400", error)
            print()
            self.send_json({"error": str(error)}, 400)
            return
        except Exception as error:
            print("<-- RESPONSE 500", error)
            print()
            self.send_json({"error": "Could not draw the chart."}, 500)
            return

        print(f"<-- RESPONSE PNG image, {len(png)} bytes")
        print()

        self.send_png(png)

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(HELP_TEXT.encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_png(self, png):
        self.send_response(200)
        self.send_header("Content-Type", "image/png")
        self.send_header("Content-Length", str(len(png)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        self.wfile.write(png)

    def send_json(self, thing, status_code):
        body = json.dumps(thing).encode("utf-8")

        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        self.wfile.write(body)


if __name__ == "__main__":
    server = HTTPServer(("localhost", PORT), ChartHandler)
    print("Chart service is running.")
    print(f"POST your charts to http://localhost:{PORT}/chart")
    print("Press Ctrl+C to stop it.")
    server.serve_forever()
