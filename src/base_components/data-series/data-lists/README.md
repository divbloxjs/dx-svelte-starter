# Introduction

These are example rows, used within the `variantRowless.svelte` component

When using any of these data lists, you need to import both the data list wrapper, as well as the row you want it to render.

```js
import DataListTwo from "../data-series/data-lists/variantRowless.svelte";
import ListRowOne from "$src/base_components/data-series/data-lists/rows/rowOne.svelte";
```

The `variantRowless.svelte` component handles all common functionality for the data list:

A `genericHeader.svelte` is provided that deals with:

-   search
-   refresh
-   create

The datalist itself handles when to display loading states, as well as 'load more' functionality.

You need to pass in the rowActions object if the row itself will have any actions associated with it. These events will bubble up via the actionTriggered() function, and are accessible as such from the data list.

```js
let rowActions = [
    {
        type: "delete",
        btnClasses: "btn-link text-base-content hover:text-error",
        clickEvent: "delete_clicked",
    },
];
```

```js
<DataListTwo
    bind:this={dataLists.exampleOne}
    dataSource="src/base_components/data-series/tests/row-two.json"
    rowsPerPage={5}
    enableCreate={true}
    rowComponent={ListRowTwo}
    on:actionTriggered={async (event) => {
        switch (event.detail.clickEvent) {
            case "delete_clicked":
                console.log(event.detail.clickEvent);
                break;
            case "create_clicked":
                console.log(event.detail.clickEvent);
                break;
        }
    }}
    additionalRowProps={{
        categoryUpdateEndpoint: "",
        additionalCategoryParams: {},
    }}
    rowDataMappingOverride={{
        rowTitle: "displayName",
        rowDescription: "emailAddress",
        rowCategoryName: "roleName",
        imageUrl: "profilePictureUrl",
        possibleCategories: "possibleOrganisationRoles",
    }}
    rowActions={[
        {
            type: "delete",
            btnClasses: "btn-link text-base-content hover:text-error",
            clickEvent: "delete_clicked",
        },
    ]}
/>
```
