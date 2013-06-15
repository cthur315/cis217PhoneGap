var deviceReadyDeferred = $.Deferred();
var jqmReadyDeferred = $.Deferred();

document.addEventListener("deviceReady", deviceReady, false);

function deviceReady() {
    deviceReadyDeferred.resolve();
}

$(document).one("mobileinit", function () {
    jqmReadyDeferred.resolve();
});

$.when(deviceReadyDeferred, jqmReadyDeferred).then(doWhenBothFrameworksLoaded);

function doWhenBothFrameworksLoaded() {
    var checked = "input:checked";
    var selected = "option:selected";

    //Order Tabs
    var order_nav = $("#order_nav a");
    order_nav.click(function (){
        order_nav.each(function(){
            tab = $(this).attr("href");
            $(tab).addClass("hide_tab");
        });

        var tab = $(this).attr("href");
        $(tab).removeClass();
    });

    //Drinks selection
    $("#drink_selection").find("input").click(function (){
        //$(this).append('<select');
    });

    //Customize Pizza
    $("#pizza_size").change(function (){
        var value = $("#pizza_size").find(selected).text();
        $("#size_text .ui-btn-text").text("Size - " + value);
    });

    $("#pizza_crust").change(function (){
        var value = $("#pizza_crust").find(selected).text();
        $("#crust_text .ui-btn-text").text("Crust - " + value);
    });

    $("input[name='sauce']").change(function() {
        var type = $("input[name='sauce']:checked").next().text();
        var amount = $("#sauce_amount").find(selected).text();
        var sauce_text = $("#sauce_text .ui-btn-text");

        if(amount.trim() == "No Sauce") {
            sauce_text.text("Sauce - No Sauce");
        } else {
            sauce_text.text("Sauce - " + amount + " " + type + "Sauce");
        }
    });

    $("#sauce_amount").change(function() {
        var type = $("input[name='sauce']:checked").next().text();
        var amount = $("#sauce_amount").find(selected).text();
        var sauce_text = $("#sauce_text .ui-btn-text");

        if(amount.trim() == "No Sauce") {
            sauce_text.text("Sauce - No Sauce");
        } else {
            sauce_text.text("Sauce - " + amount + " " + type + "Sauce");
        }
    });

    $("#cheese_amount").change(function() {
        var amount = $("#cheese_amount").find(selected).text();
        $("#cheese_text .ui-btn-text").text("Cheese - " + amount);
    });

    $("#toppings").find("input[type='checkbox']").change(function() {
        var amount = $("#toppings").find(checked).length;
        if(amount > 2) {
            var extra = ((amount - 2) * 0.5).toFixed(2);
            $("#num_text").html("- " + amount + " Selected (+$" + extra + ")");
        } else {
            $("#num_text").html("- " + amount + " Selected");
        }
    });

    function price_pizza() {
        price = 0.00;
        num_toppings = $("#toppings").find(checked).length;
        price += $(selected).data("price");
        price += $("#sauce_amount").find(selected).data("price");
        price += $("#cheese_amount").find(selected).data("price");

        if(num_toppings > 2) {
            price += (num_toppings - 2) * 0.5
        }
    }

    function pizza_info() {
        pizza_size = $("#pizza_size").find(selected).data("info");
        pizza_crust = $("#pizza_crust").find(selected).data("info");
        sauce_amount = $("#sauce_amount").find(selected).data("info");
        cheese_amount = $("#cheese_amount").find(selected).data("info") + " Cheese";
        toppings = "";

        if(sauce_amount == "No Sauce") {
            sauce_type = "";
            sauce_info = sauce_amount;
        } else {
            sauce_type = $("#sauce_type").find(checked).data("info");
            sauce_info = sauce_amount + " " + sauce_type;
        }

        if(num_toppings > 0) {
            var list = $("#toppings").find(checked);
            list.each(function (){
                var topping = $(this).data("info");
                toppings += topping + ", ";
            });
        }
    }

    function order_total() {
        var totalPrice = 0;
        $(".price").each(function() {
            totalPrice += $(this).data("price");
            console.log(totalPrice.toFixed(2));
        });
        $("#grand_total").html("$" + totalPrice.toFixed(2));
    }

    $("#price_pizza").on("click", function (){
        price_pizza();

        var subtotal = $("#pizza_subtotal");
        subtotal.text("Price = $" + price.toFixed(2));
        subtotal.addClass("pizza_price");

        return false;
    });

    pizzas = [];
    num_pizzas = 0;

    function new_pizza(pizza) {
        var order_item = '<div class="order_item"><p class="pizza_name"><span class="bold_text">' + pizza.name + '</span></p><p class="pizza_info">' + pizza.description + '</p><p class="pizza_info">' + pizza.toppings + '</p><p class="price" data-price="' + pizza.total + '">' + pizza.total + '</p></div>';
        $("#display_order").append(order_item);

        return order_item;
    }

    function new_side(side) {
        var order_item = '<div class="order_item"><p class="side_name"><span class="bold_text">' + side.name + '</span></p><p data-price="' + side.price + '" class="price">' + side.price.toFixed(2) + '</p></div>';
        $('#display_order').append(order_item);
    }

    $("#add_pizza").on("click", function () {
        price_pizza();
        pizza_info();

        var pizza = new Object();
        pizza.total = price.toFixed(2);
        pizza.name = pizza_size + " " + pizza_crust + " Pizza";
        pizza.description = sauce_info + ", " + cheese_amount;
        pizza.toppings = toppings.slice(0, - 2);

        pizzas[num_pizzas] = pizza;
        num_pizzas++;

        $.mobile.changePage('#order_confirm', 'pop', true, true);
        $('#order_details').html(new_pizza(pizza));

        return false;
    });

    extras = [];
    num_extras = 0;

    $("#add_drinks").on("click", function (){
        var num_drinks = $("#drink_selection").find(checked).length;
        drinks = "";

        if(num_drinks > 0) {
            var list = $("#drink_selection").find(checked);
            list.each(function (){
                var add_extra = new Object();
                add_extra.name = $(this).data("info");
                add_extra.price = 1.50;
                extras[num_extras] = add_extra;

                new_side(add_extra);

                drinks += add_extra.name + ", ";
                num_extras++;
            });
            drinks = drinks.slice(0, - 2);

            $.mobile.changePage('#order_confirm', 'pop', true, true);
            $('#order_details').html(drinks);
        }

        return false;
    });

    $("#add_side").on("click", function () {
        var num_sides = $("#sides_selection").find(checked).length;
        sides = "";

        if(num_sides > 0) {
            var list = $("#sides_selection").find(checked);
            list.each(function () {
                var $this = $(this);
                var add_extra = new Object();
                add_extra.name = $this.data("info");
                add_extra.price = $this.data("price");
                extras[num_extras] = add_extra;

                new_side(add_extra);

                sides += add_extra.name + ", ";
                num_extras++;
            });
            sides = sides.slice(0, - 2);

            $.mobile.changePage('#order_confirm', 'pop', true, true);
            $('#order_details').html(sides);
        }
    });

    function calc_total() {
        $('#order_details').html("");
        order_total();
    }

    $("#calc_total").on("click", function () {
        calc_total();
    });

    $("#submit_order").on("click", function() {
        $("#order_btns").hide();
        $("#saved").hide();

        calc_total();
        //load php form
    });

    $("#save_order").on("click", function() {
        console.log( JSON.stringify(pizzas));
        localStorage['pizzas'] = JSON.stringify(pizzas);
        localStorage['extras'] = JSON.stringify(extras);

    });

    $("#load_order").on("click", function() {
        $("#display_order").html("");
        pizzas = [];
        num_pizzas = 0;
        extras = [];
        num_extras = 0;
        pizzas = JSON.parse(localStorage['pizzas']);
        extras = JSON.parse(localStorage['extras']);
        while(num_pizzas < pizzas.length) {
            new_pizza(pizzas[num_pizzas]);
            num_pizzas++;
        }
        while(num_extras < extras.length) {
            new_side(extras[num_extras]);
            num_extras++;
        }
    });
}
