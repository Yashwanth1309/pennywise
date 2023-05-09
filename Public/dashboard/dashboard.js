function incrementDate() {
      const dateInput = document.getElementById('date-input');
      const currentDate = new Date(dateInput.value);
      const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      dateInput.value = nextDate.toISOString().split('T')[0];
    }

    function decrementDate() {
      const dateInput = document.getElementById('date-input');
      const currentDate = new Date(dateInput.value);
      const prevDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      dateInput.value = prevDate.toISOString().split('T')[0];
    }

 //    function hide(){
 //      document.getElementsByClassName("hide_or_not").classList.add("hidden");
 //    }
 //
 //    function nothidden(){
 //      document.getElementById("hide").classList.remove("hidden");
 //    }
 //
 //
 // var index = document.getElementById("sort-select").selectedIndex;
 // if (index==4 || index==5){
 //   hide();
 // }else{
 //   nothidden();
 // }
