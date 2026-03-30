---
name: power-bi-r-visuals
description: >
  R script visuals in Power BI using ggplot2 and other R packages for statistical
  visualizations, advanced charts, and custom graphics.
  USE WHEN: "R visual Power BI", "ggplot2 in Power BI", "R script visual",
  "statistical chart Power BI", "boxplot R", "density plot", "violin plot",
  "correlation matrix", "R custom visual", "advanced statistics Power BI".
  RELATED SKILLS: power-bi-python-visuals, power-bi-deneb-visuals, power-bi-report-design-consultation.
---

# R Visuals in Power BI — ggplot2 & Beyond

You are an expert in creating R script visuals for Power BI. R visuals enable advanced statistical charts and custom graphics using the full R ecosystem.

## Prerequisites

- R runtime installed locally (CRAN R 3.4.4+ or Microsoft R Open)
- Configure in Power BI Desktop: File → Options → R scripting → R home directory
- Supported packages: ggplot2, plotly, corrplot, lattice, and 100+ CRAN packages

## How R Visuals Work

1. Add an **R script visual** from the Visualizations pane
2. Drag fields into the visual's Values well
3. Power BI creates a dataframe called `dataset` with those fields
4. Write R script to produce a plot
5. Power BI renders the last plot output as a static image

## Basic Pattern

```r
# 'dataset' is automatically created by Power BI
# with all fields dragged into the visual's Values well

library(ggplot2)

ggplot(dataset, aes(x = Category, y = TotalSales)) +
  geom_bar(stat = "identity", fill = "#4682B4") +
  theme_minimal() +
  labs(title = "Sales by Category", x = NULL, y = "Revenue")
```

## Common Chart Recipes

### Box Plot (Distribution Analysis)

```r
library(ggplot2)

ggplot(dataset, aes(x = Region, y = Revenue, fill = Region)) +
  geom_boxplot(alpha = 0.7, outlier.color = "#DC143C") +
  scale_fill_brewer(palette = "Set2") +
  theme_minimal() +
  theme(legend.position = "none") +
  labs(title = "Revenue Distribution by Region", x = NULL, y = "Revenue")
```

### Violin Plot

```r
library(ggplot2)

ggplot(dataset, aes(x = Category, y = Amount, fill = Category)) +
  geom_violin(alpha = 0.6, trim = FALSE) +
  geom_boxplot(width = 0.1, alpha = 0.8) +
  scale_fill_brewer(palette = "Pastel1") +
  theme_minimal() +
  theme(legend.position = "none") +
  labs(title = "Amount Distribution", x = NULL)
```

### Correlation Matrix

```r
library(ggplot2)
library(reshape2)

# Select numeric columns only
nums <- dataset[sapply(dataset, is.numeric)]
corr_matrix <- cor(nums, use = "complete.obs")
melted <- melt(corr_matrix)

ggplot(melted, aes(x = Var1, y = Var2, fill = value)) +
  geom_tile(color = "white") +
  scale_fill_gradient2(low = "#DC143C", mid = "white", high = "#2E8B57",
                       midpoint = 0, limit = c(-1, 1)) +
  geom_text(aes(label = round(value, 2)), size = 3) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  labs(title = "Correlation Matrix", x = NULL, y = NULL, fill = "Correlation")
```

### Density Plot

```r
library(ggplot2)

ggplot(dataset, aes(x = Amount, fill = Category)) +
  geom_density(alpha = 0.5) +
  scale_fill_brewer(palette = "Set2") +
  theme_minimal() +
  labs(title = "Amount Distribution by Category", x = "Amount", y = "Density")
```

### Lollipop Chart

```r
library(ggplot2)

dataset <- dataset[order(dataset$Value), ]
dataset$Category <- factor(dataset$Category, levels = dataset$Category)

ggplot(dataset, aes(x = Category, y = Value)) +
  geom_segment(aes(xend = Category, y = 0, yend = Value), color = "grey60") +
  geom_point(size = 4, color = "#4682B4") +
  coord_flip() +
  theme_minimal() +
  labs(title = "Values by Category", x = NULL, y = NULL)
```

### Waterfall Chart

```r
library(ggplot2)

dataset$end <- cumsum(dataset$Value)
dataset$start <- c(0, head(dataset$end, -1))
dataset$color <- ifelse(dataset$Value >= 0, "#2E8B57", "#DC143C")
dataset$Category <- factor(dataset$Category, levels = dataset$Category)

ggplot(dataset, aes(x = Category)) +
  geom_rect(aes(xmin = as.numeric(Category) - 0.4,
                xmax = as.numeric(Category) + 0.4,
                ymin = start, ymax = end, fill = color)) +
  scale_fill_identity() +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  labs(title = "Waterfall Analysis", x = NULL, y = "Cumulative Value")
```

## Theming for Power BI

```r
# Custom theme matching Power BI aesthetics
pbi_theme <- theme_minimal() +
  theme(
    text = element_text(family = "Segoe UI", color = "#333333"),
    plot.title = element_text(size = 14, face = "bold", margin = margin(b = 10)),
    axis.text = element_text(size = 10),
    panel.grid.minor = element_blank(),
    panel.grid.major = element_line(color = "#E0E0E0"),
    legend.position = "bottom",
    plot.background = element_rect(fill = "white", color = NA)
  )

# Apply
ggplot(dataset, aes(x = X, y = Y)) + geom_point() + pbi_theme
```

## Limitations

| Limitation | Detail |
|-----------|--------|
| Static output | R visuals render as images, no interactivity |
| No cross-filtering | R visuals cannot be cross-filtered by other visuals |
| Row limit | 150,000 rows maximum passed to R script |
| Timeout | 5-minute execution limit |
| No R visual in dashboards | Only in reports |
| Package availability | Must be installed locally; service uses limited set |

## Validation Checklist

- [ ] R runtime configured in Power BI Desktop options
- [ ] Required packages installed (`install.packages("ggplot2")`)
- [ ] Script uses `dataset` as the input dataframe
- [ ] Script produces a visible plot (not just data)
- [ ] Plot renders within Power BI's aspect ratio
- [ ] Fonts are available on the system (prefer "Segoe UI")
- [ ] Row count under 150K limit
- [ ] No file system access or network calls in script
