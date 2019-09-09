function addElementOnTable() {
    var markup = 
    "<tr><td class='text-left'>Sample 1</td>" + 
    "<td class='text-left'>limestone sample</td>"+
    "<td><select class='custom-select' id='inpType'>"+
        "<option selected>Other</option>"+
        "<option value='1'>Sample</option>"+
        "<option value='2'>Panoramic</option>"+
        "<option value='3'>Route</option>"+
    "</select></td>"+
    "<td><input type='checkbox' name='remove' class='align-middle'></td></tr>";

    $("#kmlTable").append(markup);
};

function removeElementOnTable(){
    $("#kmlTable").find('input[name="remove"]').each(function(){
        if($(this).is(":checked")){
            $(this).parents("tr").remove();
        }
    });
};

//Preciso ler o kml, e com o codigo de baixo, criar os elemenos na tabela de placemarks a cima!

function readKML(){
    $.get("kml.xml", function(data){
        html = "";

        //loop through placemarks tags
        $(data).find("Placemark").each(function(index, value){
            //get coordinates and place name
            coords = $(this).find("coordinates").text();
            place = $(this).find("name").text();
            //store as JSON
            c = coords.split(",")
            nav.push({
                "place": place,
                "lat": c[0],
                "lng": c[1]
            })
            //output as a navigation
            html += "<li>" + place + "</li>";
        })
        //output as a navigation
        $(".navigation").append(html);
    });

}