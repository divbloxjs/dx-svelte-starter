const getPossible((selectOption))Options = async () => {
        const get((selectOption))Result = await get((selectOption))Options(((selectOptionParameters)));

        if (get((selectOption))Result === null) {
            return;
        }

        let options = {};
        get((selectOption))Result.forEach((((selectOption))) => {
            options[((selectKey))] = ((selectOption)).((selectDisplayValue));
        });

        ((selectOption))Options.options = options;
    };