# Stacked vs grouped bars

Stacked: same `stack` value across series. Grouped: omit `stack` (or unique).

### Fully stacked
```json
{ "series": [
  { "type": "bar", "name": "Direct",   "stack": "total", "data": [120,132,101,134] },
  { "type": "bar", "name": "Referral", "stack": "total", "data": [220,182,191,234] },
  { "type": "bar", "name": "Organic",  "stack": "total", "data": [150,232,201,154] }
] }
```

### Grouped
Remove `stack` from all series. Tune spacing with:
```json
{ "barGap": "10%", "barCategoryGap": "20%" }
```

### Mixed (1 standalone + 2 stacked)
```json
{ "series": [
  { "type": "bar", "name": "Direct",   "stack": "paid", "data": [...] },
  { "type": "bar", "name": "Referral", "stack": "paid", "data": [...] },
  { "type": "bar", "name": "Organic",                   "data": [...] }
] }
```
