import './status-message.js'
import "./action-button.js"
import './ojs-plot.js'

import * as Plot from "@observablehq/plot";

import sharedStyles from './styles.css?inline';

let webrMessage = document.getElementById("webr-status");

import { webR } from './r.js'

await R`
webr::install(c("ggplot2", "svglite"))

library(ggplot2)
library(svglite)
`

const numbers = await webR.evalRRaw(`vals <- sample(100, 20); vals`, "number[]")

webrMessage.text = "Loaded!"

const ggplotDiv = document.querySelector("#ggplot")
const rectYchart = document.querySelector('#rect-plot');
const regenButton = document.querySelector("#regen")

rectYchart.appStyles = sharedStyles;


rectYchart.chartOptions = {
  style: {
    color: "hsl(48,58.14%,33.73%)",
  },
  marks: [
    Plot.rectY(numbers)
  ]
};

const plotCode = `
svgstring(
  width = 640/100, 
  height = 500/100,
  bg = "transparent"
) -> out

ggplot() +
  geom_col(
    aes(1:length(vals), vals),
    fill = "#887424",
    width = 0.97
  ) +
  theme_minimal() +
  scale_x_continuous(
    expand = c(0, 0, 0, 0)
  ) +
  scale_y_continuous(
    expand = c(0, 0, 0, 0)
  ) +
  labs(
    x = NULL, y = NULL,
    title = "A ggplot2 Plot Generated From R Data"
  ) +
  theme(
    plot.title = element_text(
      color = "white",
      size = 20,
      face = "bold",
      margin = margin(b = 30)
    ),
    plot.background = element_rect(
      fill = "transparent",
      color = "transparent"
    ),
    plot.margin = margin(
      l = 16, r = 6, t = 12, b = 0
    ),
    panel.grid.major = element_blank(),
    panel.grid.minor = element_blank(),
    axis.text = element_text(
      color = "#887424"
    )
  ) -> gg

print(gg)

out()
`;

ggplotDiv.innerHTML = await webR.evalRRaw(plotCode, "string")

regenButton.onClick = async () => {
  const numbers = await webR.evalRRaw(`vals <- sample(100, 20); vals`, "number[]")
  ggplotDiv.innerHTML = await webR.evalRRaw(plotCode, "string")
  rectYchart.chartOptions = {
    style: {
      color: "hsl(48,58.14%,33.73%)",
    },
    marks: [
      Plot.rectY(numbers)
    ]
  };

}
