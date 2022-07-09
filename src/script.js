$('#rangestart').calendar({
    type: 'date',
    endCalendar: $('#rangeend')
  });
  $('#rangeend').calendar({
    type: 'date',
    startCalendar: $('#rangestart')
  });


  
//     $('.ui.progress')
//     .progress({
//       duration : 200,
//       total    : 2,
//       value    : 1,
//       text     : {
//         active: '{value} of {total} done'
//       }
//     })
// ;





const toDo = {
  createNewTask: function (userTexst, taskId, total, value) {
    const taskTest = document.createElement('div')
    
    const uiToggleCheckbox = document.createElement('div')
    const checkbox = document.createElement('input')
    const labelCB = document.createElement('label')

    const taskTexst = document.createElement('div')  

    const uiIndicatingProgress = document.createElement('div')
    const bar = document.createElement('div')
    const progress = document.createElement('div')
    const label = document.createElement('div')

    taskTexst.innerText = userTexst;
    label.innerText = 'Waiting for';

    taskTest.className = 'taskTest';
    uiToggleCheckbox.className = 'ui toggle checkbox';
    checkbox.type = 'checkbox';
    checkbox.name = 'public';
    taskTexst.className = 'taskTexst';
    uiIndicatingProgress.className = 'ui indicating progress style';
    uiIndicatingProgress.classList. add(taskId)
    bar.className = 'bar';
    progress.className = 'progress';
    label.className = 'label';

    uiIndicatingProgress.setAttribute('id', taskId);
    checkbox.dataset.taskId = taskId;
    // uiIndicatingProgress.dataset.value = "1";
    // uiIndicatingProgress.dataset.total = "200";

    taskTest.appendChild(uiToggleCheckbox);
    taskTest.appendChild(taskTexst);
    taskTest.appendChild(uiIndicatingProgress);

    uiToggleCheckbox.appendChild(checkbox);
    uiToggleCheckbox.appendChild(labelCB);

    uiIndicatingProgress.appendChild(bar);
    uiIndicatingProgress.appendChild(progress);
    uiIndicatingProgress.appendChild(label);

    const userTask = document.querySelector('.userTask');
    userTask.appendChild(taskTest)


    checkbox.addEventListener('change', this.deleteTask.bind(this));
    this.createProgressBar(value, total, taskId)

  },

  handleFormSubmit: function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const userTexst = formData.get("task");
    const dateStart = formData.get("start");
    const dateEnd = formData.get("end");

    
    const generatedId = this.generateId();
    const { total, value } = this.transformDate(dateStart, dateEnd);

    this.createNewTask(userTexst, generatedId, total, value);
    this.clearValue();
    this.saveToLocStor(userTexst, generatedId, total, value);
    },

  transformDate: function (dateStart, dateEnd) {
    const startTime = new Date(dateStart).getTime();
    const endTime = new Date(dateEnd).getTime();

    const currentTime = new Date(new Date().setHours(0,0,0,0)).getTime();

    const rezult =(endTime - startTime) / 1000/60/60/24 + 1;
    const rest = (currentTime - startTime) / 1000/60/60/24;
    const isExpired = ((currentTime - endTime) / 1000/60/60/24) > 0;

    return { total: rezult, value: rest }
  },

    createProgressBar: function (value, total, taskId) {
      const taskIdName = '#' + taskId;

      $(taskIdName)
      .progress({
        duration : 200,
        total,
        value,
        text     : {
          active: '{value} of {total} done'
        }
      })
    },

    
    clearValue: function () {
      document.querySelector(".userTaskTexst").value = "";
      const calendarValues = document.querySelectorAll(".calendarDateInput");

      calendarValues.forEach(element => {
        element.value = '';        
      });
    },
    
    generateId: function () {
      let a = 'example';
      let b = Math.floor(Math.random() * 10000);
      return a + b;
    },

    saveToLocStor: function (taskName, taskId, rezult, rest) {
      const userData = localStorage.getItem('userData');
      const newTask = {taskName, taskId, total: rezult, value: rest};

      if (!userData) {
          localStorage.setItem('userData', JSON.stringify([newTask])) //SAVE TO LOCALsTORAGE

      } else {
          const parsedUserData = JSON.parse(userData);
          parsedUserData.push(newTask);
    
          localStorage.setItem('userData', JSON.stringify(parsedUserData));
    
      }
    },


    renderTaskList: function () {
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
      } else {
        document.querySelector(".userTask").innerHTML = "";

        const parsedUserData = JSON.parse(userData);
        parsedUserData.forEach(element => {
            const { taskName, taskId, total, value } = element;
            this.createNewTask(taskName, taskId, total, value);
        });
      }
    
    },

    deleteTask: function (e) {
      const deleteTaskId = e.target.dataset.taskId;
      const userData = localStorage.getItem('userData');
      const parsedUserData = JSON.parse(userData);

      const res = parsedUserData.filter((item) => item.taskId !== deleteTaskId);

      localStorage.setItem('userData', JSON.stringify(res));
      this.renderTaskList();
    }
};




const form = document.querySelector(".subForm");
form.addEventListener('submit', toDo.handleFormSubmit.bind(toDo));


document.addEventListener('DOMContentLoaded', toDo.renderTaskList.bind(toDo));
