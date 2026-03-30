---
name: power-bi-python-visuals
description: >
  Python script visuals in Power BI using matplotlib, seaborn, and plotly for
  statistical visualizations, heatmaps, and custom graphics.
  USE WHEN: "Python visual Power BI", "matplotlib in Power BI", "seaborn chart",
  "Python script visual", "heatmap Python", "pair plot", "Python custom visual",
  "advanced chart Python", "pandas visualization".
  RELATED SKILLS: power-bi-r-visuals, power-bi-deneb-visuals, power-bi-report-design-consultation.
---

# Python Visuals in Power BI — matplotlib & seaborn

You are an expert in creating Python script visuals for Power BI. Python visuals leverage matplotlib, seaborn, and pandas for advanced data visualization.

## Prerequisites

- Python 3.7+ installed (Anaconda recommended)
- Configure in Power BI Desktop: File → Options → Python scripting → Python home directory
- Required packages: `matplotlib`, `seaborn`, `pandas` (pre-installed with Anaconda)

## How Python Visuals Work

1. Add a **Python script visual** from the Visualizations pane
2. Drag fields into the visual's Values well
3. Power BI creates a pandas DataFrame called `dataset`
4. Write Python script to produce a matplotlib figure
5. Power BI renders `plt.show()` output as a static image

## Basic Pattern

```python
import matplotlib.pyplot as plt
import pandas as pd

# 'dataset' is automatically created by Power BI
fig, ax = plt.subplots(figsize=(8, 5))
ax.bar(dataset['Category'], dataset['TotalSales'], color='#4682B4')
ax.set_title('Sales by Category', fontsize=14, fontweight='bold')
ax.set_ylabel('Revenue')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
```

## Common Chart Recipes

### Heatmap (Correlation or Pivot)

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Pivot data for heatmap
pivot = dataset.pivot_table(values='Value', index='Row', columns='Column', aggfunc='sum')

fig, ax = plt.subplots(figsize=(10, 8))
sns.heatmap(pivot, annot=True, fmt='.0f', cmap='YlOrRd',
            linewidths=0.5, ax=ax, cbar_kws={'label': 'Value'})
ax.set_title('Value Heatmap', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

### Pair Plot (Multi-Variable Relationships)

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Select numeric columns
cols = ['Revenue', 'Quantity', 'Discount', 'Profit']
g = sns.pairplot(dataset[cols], diag_kind='kde',
                 plot_kws={'alpha': 0.6, 'color': '#4682B4'},
                 diag_kws={'color': '#4682B4'})
g.fig.suptitle('Variable Relationships', y=1.02, fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

### Histogram with KDE

```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, ax = plt.subplots(figsize=(8, 5))
sns.histplot(data=dataset, x='Amount', hue='Category', kde=True,
             alpha=0.6, palette='Set2', ax=ax)
ax.set_title('Amount Distribution', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

### Box + Swarm Plot

```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, ax = plt.subplots(figsize=(10, 6))
sns.boxplot(data=dataset, x='Region', y='Revenue',
            palette='Set2', fliersize=0, ax=ax)
sns.swarmplot(data=dataset, x='Region', y='Revenue',
              color='black', alpha=0.3, size=3, ax=ax)
ax.set_title('Revenue by Region', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

### Treemap

```python
import matplotlib.pyplot as plt
import squarify  # pip install squarify

sizes = dataset['Value'].tolist()
labels = [f"{cat}\n{val:,.0f}" for cat, val in
          zip(dataset['Category'], dataset['Value'])]
colors = plt.cm.Set2(range(len(sizes)))

fig, ax = plt.subplots(figsize=(10, 7))
squarify.plot(sizes=sizes, label=labels, color=colors,
              alpha=0.8, ax=ax, text_kwargs={'fontsize': 10})
ax.set_title('Category Breakdown', fontsize=14, fontweight='bold')
ax.axis('off')
plt.tight_layout()
plt.show()
```

### Donut Chart

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 8))
colors = ['#4682B4', '#2E8B57', '#FF8C00', '#DC143C', '#9370DB']
wedges, texts, autotexts = ax.pie(
    dataset['Value'], labels=dataset['Category'],
    autopct='%1.1f%%', colors=colors[:len(dataset)],
    pctdistance=0.85, startangle=90
)
# Donut hole
centre = plt.Circle((0, 0), 0.6, fc='white')
ax.add_artist(centre)
ax.set_title('Category Composition', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

### Time Series with Annotations

```python
import matplotlib.pyplot as plt
import pandas as pd

dataset['Date'] = pd.to_datetime(dataset['Date'])
dataset = dataset.sort_values('Date')

fig, ax = plt.subplots(figsize=(12, 5))
ax.plot(dataset['Date'], dataset['Value'], color='#4682B4', linewidth=2)
ax.fill_between(dataset['Date'], dataset['Value'], alpha=0.1, color='#4682B4')

# Annotate max
max_idx = dataset['Value'].idxmax()
ax.annotate(f"Peak: {dataset.loc[max_idx, 'Value']:,.0f}",
            xy=(dataset.loc[max_idx, 'Date'], dataset.loc[max_idx, 'Value']),
            xytext=(10, 20), textcoords='offset points',
            arrowprops=dict(arrowstyle='->', color='#DC143C'),
            fontsize=10, color='#DC143C')

ax.set_title('Trend Analysis', fontsize=14, fontweight='bold')
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.show()
```

## Theming for Power BI

```python
import matplotlib.pyplot as plt

# Set global Power BI-compatible theme
plt.rcParams.update({
    'font.family': 'Segoe UI',
    'font.size': 10,
    'axes.titlesize': 14,
    'axes.titleweight': 'bold',
    'axes.labelsize': 11,
    'figure.facecolor': 'white',
    'axes.facecolor': 'white',
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.color': '#E0E0E0',
})
```

## Limitations

| Limitation | Detail |
|-----------|--------|
| Static output | Python visuals render as images, no interactivity |
| No cross-filtering | Cannot be cross-filtered by other visuals |
| Row limit | 150,000 rows maximum |
| Timeout | 5-minute execution limit |
| Package availability | Service supports limited set (matplotlib, seaborn, pandas, scikit-learn) |
| No file I/O | Cannot read/write files in Power BI service |

## Validation Checklist

- [ ] Python runtime configured in Power BI Desktop options
- [ ] Script uses `dataset` as the input DataFrame
- [ ] Script ends with `plt.show()`
- [ ] `plt.tight_layout()` called to avoid clipping
- [ ] Figure size set appropriately (`figsize`)
- [ ] Fonts available on system (prefer "Segoe UI")
- [ ] No file system access or network calls
- [ ] Row count under 150K limit
