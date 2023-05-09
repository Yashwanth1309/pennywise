// function incrementDate() {
//     const dateInput = document.getElementById('date-input');
//     const currentDate = new Date(dateInput.value);
//     const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
//     dateInput.value = nextDate.toISOString().split('T')[0];
//   }

//   function decrementDate() {
//     const dateInput = document.getElementById('date-input');
//     const currentDate = new Date(dateInput.value);
//     const prevDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
//     dateInput.value = prevDate.toISOString().split('T')[0];
//   }
  $("#laddbtn").click(function () {
    let table=$.getElementById('ltable');
    let row=table.insertRow(-1);
    c1.innerText,c2.innerText,c3.innerText,c4.innerText,c5.innerText,c6.innerText='hi','hello','hey','there','how','you'
    let c1=row.insertCell(0);
    let c2=row.insertCell(1);
    let c3=row.insertCell(2);
    let c4=row.insertCell(3);
    let c5=row.insertCell(4);
    let c6=row.insertCell(5);
    
  });