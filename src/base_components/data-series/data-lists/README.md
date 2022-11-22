# Introduction

These are example rows, used within the `variantRowless.svelte` component

When using any of these data lists, you need to import both the data list wrapper, as well as the row you want it to render.

```js
import DataListTwo from "../data-series/data-lists/variantRowless.svelte";
import ListRowOne from "$src/base_components/data-series/data-lists/rows/rowOne.svelte";
import RowAction from "$src/base_components/data-series/data-lists/rows/rowAction.svelte";
```

The `variantRowless.svelte` component handles all common functionality for the data list:

A `genericHeader.svelte` is provided that deals with:

-   search
-   refresh
-   create

The datalist itself handles when to display loading states, as well as 'load more' functionality.

You need to pass in the rowActions object if the row itself will have any actions associated with it. These events will bubble up via the actionTriggered() function, and are accessible as such from the data list.

YOu can then pass in what row you would like the list to load. Three examples are provided out of the box:

`rowOne.svelte`, `rowTwo.svelte` and `rowThree.svelte`. These are meant to be fairly generic for displaying certain configurations of data. You are encouraged to take them as a template and create your own if needed.

You can pass the row component into the data list using svelte <slots>.

**NOTE: All the parameters you need for the slotted component, you need to expose via the 'let:' directive in the datalist component. i.e. `let:rowData`, `let:rowIndex` and `let:listLength`**

```js
<DataList
    bind:this={dataLists.exampleOne}
    dataSource="src/base_components/data-series/tests/row-two.json"
    on:actionTriggered={async (event) => {
        switch (event.detail.clickEvent) {
            case "create_clicked":
                console.log(event.detail);
                break;
        }
    }}
    let:rowData
    let:rowIndex
    let:listLength>
    <ListRowOne
        {rowData}
        {rowIndex}
        {listLength}
        rowDataMappingOverride={{
            rowTitle: "displayName",
        }}
        on:actionTriggered={(event) => {
            console.log("handled in parent: ", event.detail);
        }} />
</DataList>
```

There are 4 pre-configured row actions that you can add to rows as well. These are

1. View
2. Edit
3. Duplicate
4. Delete

The icons, styling, and event forwarding will be done for you, all you need to do is handle application specific logic. Again, notice that `rowData` needs to be exposed via the let: directive.

```js
<ListRowTwo
    {rowData}
    {rowIndex}
    {listLength}
    rowDataMappingOverride={{
        rowTitle: "displayName",
    }}
    let:rowActionTriggered
    on:actionTriggered={(event) => {
        console.log("handled in parent: ", event.detail);
    }}>
    <RowAction
        {rowData}
        action={{ type: "edit" }}
        on:actionTriggered={rowActionTriggered} />
</ListRowTwo>
```
