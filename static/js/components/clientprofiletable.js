$(function (event) {
    var status = $('.dot');
    var table = $('#clients tbody');

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
        },
        url: "api/statuses",
        method: "GET",
        success: function (data) {
            console.log(data);
        },
        error: function (xhr) {
            console.error(xhr);

            if (xhr.status === 401) {
                localStorage.removeItem("authorization");
            }
        }
    }).done(function (statuses) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
            },
            url: "api/clients",
            method: "GET",
            success: function (data) {
                status.removeClass('dot-pending').addClass('dot-success');
                console.log(data);
                table.empty();
                data.result.forEach(function (client) {
                    var dataString = "";
                    for (var property in client) {
                        dataString += 'data-' + property.toLowerCase() + '="' + client[property] + '" ';
                    }
                    table.append('<tr class="profile-drag"><td ' + dataString + '>' +
                        '<span class="dot"></span>' +
                        client.firstName + ' ' +
                        client.lastName + ' ' +
                        '</td></tr>');
                });
                console.log(statuses.result);
                $(table).children('tr').get().forEach(function (clientRow) {
                    console.log($(clientRow).find('td').data("status"));
                    var currentStatus = statuses.result.filter(function (obj) { 
                        if (obj.id === $(clientRow).find('td').data("status")) {
                            return obj;
                        } 
                    })[0];
                    console.log(currentStatus);
                    $(clientRow).find('.dot').css('background-color', currentStatus.color);
                });
            },
            error: function (xhr) {
                status.removeClass('dot-pending').addClass('dot-error');
                console.error(xhr);

                if (xhr.status === 401) {
                    localStorage.removeItem("authorization");
                }
            }
        });
    });

    $('#client-search').keyup(function () {
        var search = $('#client-search');
        var clients = $('#clients td');
        if (search.val() === '') {
            clients.show();
        } else {
            clients.hide().filter(function (i, e) {
                return $(e).text().toLowerCase().indexOf(search.val().toLowerCase()) !== -1;
            }).show();
        }
    });

    /*
    
        can insert and retrieve using jQuery's data function
        
        <td class="submit" data-id="1">John Doe</td>
        var id = $(this).data("id");

        // $.data() knows to grab any attribute with "data-"
        // $.data("id", 1) will insert into the "data-id" attribute
    */
});
