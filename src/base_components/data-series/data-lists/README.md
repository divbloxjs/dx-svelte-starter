# Introduction

This folder hold all the components needed to render 4 preconfigured data lists, as well as provide a wrapper for any custom data lists you would like to make in your project.

When using a data list, you need to import both the data list wrapper, as well as the row you want it to render.

```js
import DataListWrapper from "$src/base_components/data-series/data-lists/dataListWrapper.svelte";
import DataListRow from "$src/base_components/data-series/data-lists/row-variants/geneva.svelte";
```

You can also add a subset of the configured rowActions if needed. These are components that handle with rendering a button and firing off needed events for the button action.

```js
import DataListRowAction from "$src/base_components/data-series/data-lists/dataListRowAction.svelte";
```

Pre-configured row actions cater for:

-   edit
-   view
-   duplicate
-   delete

## Component structure

The `dataListWrapper` component handles all common functionality for a data list:

-   when to display loading states, as well as 'load more' functionality.

It also loads in a header, a row component as well as a subset of available row actions per row.

You can pass the row component into the data list using svelte `<slots>`.

> **NOTE: All the parameters you need for the slotted component, you need to expose via the 'let:' directive in the datalist component. i.e. `let:rowData`, `let:rowIndex`, `let:listLength` and `let:showLoadingState`**

```js
<DataList
    bind:this={dataListEl}
    dataSource="https://my-server.com/api/data-endpoint?someId=1"
    on:actionTriggered={async (event) => {
        switch (event.detail.clickEvent) {
            case "event_fired":
                doSomething(event.detail);
                break;
        }
    }}
    let:rowData
    let:rowIndex
    let:listLength
    let:showLoadingState>
    <ListRowTwo
        {rowData}
        {rowIndex}
        {listLength}
        {showLoadingState}
        rowDataMappingOverride={{
            rowTitle: "displayName",
            rowDescription: "emailAddress",
            rowCategoryName: "roleName",
            imageUrl: "profilePictureUrl",
            possibleCategories: "possibleOrganisationRoles",
        }}
        let:rowActionTriggered
        on:actionTriggered={(event) => {
            switch (event.detail.clickEvent) {
            case "event_fired":
                doSomething(event.detail);
                break;
        }
        }}
        additionalRowProps={{
            categoryUpdateEndpoint: "",
            additionalCategoryParams: {},
        }}>
        <RowAction
            {rowData}
            action={{ type: "edit" }}
            on:actionTriggered={rowActionTriggered} />
    </ListRowTwo>
</DataList>
```

A default header, `genericHeader`, is provided that allows for a user-defined subset of:

-   search
-   refresh
-   create

You need to pass in the rowActions object if the row itself will have any actions associated with it. These events will bubble up via the actionTriggered() function, and are accessible as such from the data list, as well as the component you're loading the data list in.

There are 4 pre-configured row actions that you can add to rows as well. These are:

1. View
2. Edit
3. Duplicate
4. Delete

You also pass in what row you would like the list to load. 4 examples are provided out of the box:

`geneva.svelte`, `sofia.svelte`, `toronto.svelte` and `stockholm.svelte` Each of these is meant to be fairly generic for displaying certain configurations of data.

The icons, styling, and event forwarding will be done for you, all you need to do is handle application specific logic. Again, notice that `rowData` needs to be exposed via the let: directive.

Below are shown the default row data structures for each.

## Toronto

```js
{
    imageUrl: "imageUrl", // URL of an image to render on the left of the row
    rowTitle: "rowTitle", // Row title or heading (e.g. Name)
    rowDescription: "rowDescription", // Normal text underneath the title (e.g. Email address, description)
    rowCategoryName: "rowCategoryName", // The user-specific key for what data is populated in the category dropdown (e.g. userGender)
    rowCategoryId: "rowCategoryId", // Key for accessing the category ID (used for updates on category change)
    possibleCategories: "possibleCategories", // Array of category options (e.g. ['Male', 'Female'])
}
```

## Sofia

```js
{
    rowTitle: "rowTitle", // Row title or heading (e.g. Name)
    rowDescription: "rowDescription", // Normal text underneath the title (e.g. Email address, description)
}
```

## Stockholm

```js
{
    rowTitle: "rowTitle", // Row title or heading (e.g. Name)
}
```

## Geneva

```js
{
    rowTitle: "rowTitle", // Row title or heading (e.g. Name)
    rowDescription: "rowDescription", // Normal text underneath the title (e.g. Email address, description)
    colourHexCode: "colourHexCode", // Hexcode that colours the left side of the row
}
```

There is also a `defaultRowToCopy` component. This is the starting point of creating your own custom row. All needed functions and markup is present, and you can just add any html, styling and event handling you require.

The process would be to:

-   copy the component file
-   name it according to your use case e.g. userDataListRow.svelte for displaying users
-   add in the necessary HTML and handlers for row events that you require.
