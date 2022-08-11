interface filterTextOption {
    userInput: string;
    placeholder: string;
    defaultValue: string;
}
interface filterNumberOption {
    userInput: string;
    placeholder: string;
    defaultValue: string;
}
interface filterDropdownOption {
    userInput: string;
    placeholder: string;
    defaultOptions: Array;
}

interface filterDateOption {
    userInput: Date;
    label: Date;
    placeholder: Date;
    defaultValue: Date;
}

interface filterOption {
    [propName: "fromDate" | "toDate" | "filterDropdown" | "filterText" | "filterNumber"]:
        | filterDateOption
        | filterDropdownOption
        | filterNumberOption
        | filterTextOption;
}

export interface tableColumn {
    width: string;
    sortBy: boolean;
    isSortAscending: boolean;
    filterBy?: filterOption;
    [propName: string]: any;
}

export interface tableColumns {
    [propName: string]: tableColumn;
}
