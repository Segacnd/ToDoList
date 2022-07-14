jQuery('#rangestart').calendar({
    type: 'date',
    endCalendar:jQuery('#rangeend')
  });
  jQuery('#rangeend').calendar({
    type: 'date',
    startCalendar:jQuery('#rangestart')
  });


  
//    jQuery('.ui.progress')
//     .progress({
//       duration : 200,
//       total    : 2,
//       value    : 1,
//       text     : {
//         active: '{value} of {total} done'
//       }
//     })
// ;


const ACTIVE_STATUS = 'active';
const COMPLETED_STATUS = 'complete';


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
    label.innerText = 'Comleted';

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


    if (this.currentStatus == ACTIVE_STATUS) {
      this.createProgressBar(value, total, taskId)
    }
  
    checkbox.addEventListener('change', this.deleteTask.bind(this));
  },

  createNewTaskDeleted: function (userTexst) {
    const taskTest = document.createElement('div')
    const taskTexst = document.createElement('div')

    taskTexst.innerText = userTexst;

    taskTest.className = 'taskTest gotovo';
    taskTexst.className = 'taskTexst';

    taskTest.appendChild(taskTexst);

    const userTask = document.querySelector('.userTask');
    userTask.appendChild(taskTest)
  },

  handleFormSubmit: function (event) {
    event.preventDefault();
    // location.reload();

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

     jQuery(taskIdName)
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
      const newTask = {taskName, taskId, total: rezult, value: rest, status: ACTIVE_STATUS};

      if (!userData) {
          localStorage.setItem('userData', JSON.stringify([newTask])) //SAVE TO LOCALsTORAGE

      } else {
          const parsedUserData = JSON.parse(userData);
          parsedUserData.push(newTask);
    
          localStorage.setItem('userData', JSON.stringify(parsedUserData));
    
      }
    },

    currentStatus: 'active',

    changeStatusActive: function() {
      this.currentStatus =  'active';
      this.renderTaskList()
    },

    changeStatusComplete: function() {
      this.currentStatus =  'complete';
      this.renderTaskList1()
    },

    renderTaskList: function () {
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        
      } else {
        document.querySelector(".userTask").innerHTML = "";
        
        const parsedUserData = JSON.parse(userData);
        parsedUserData.forEach(element => {
            if (element.status === this.currentStatus) {
              const { taskName, taskId, total, value, status } = element;
              this.createNewTask(taskName, taskId, total, value, status);
          } 
        });
      }
    
    },

    renderTaskList1: function () {
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
      } else {
        document.querySelector(".userTask").innerHTML = "";

        const parsedUserData = JSON.parse(userData);
        parsedUserData.forEach(element => {
            if (element.status === 'complete') {
              const { taskName } = element;
              this.createNewTaskDeleted(taskName);
          } 
        });
      }
    
    },

    timerId: 0,

    deleteTask: function (e) {
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
          if (e.target.checked){
            const deleteTaskId = e.target.dataset.taskId;
            const userData = localStorage.getItem('userData');
            const parsedUserData = JSON.parse(userData);
      
            const res = parsedUserData.map((item) => {
              if(item.taskId === deleteTaskId){
                item.status = COMPLETED_STATUS;
              } 
              
              return item;
            });
      
            localStorage.setItem('userData', JSON.stringify(res));
            this.renderTaskList();
          }  
      }, 2000)
    }
};




const form = document.querySelector(".subForm");
form.addEventListener('submit', toDo.handleFormSubmit.bind(toDo));


const buttonComplete = document.querySelector(".completed");
buttonComplete.addEventListener('click', toDo.changeStatusComplete.bind(toDo));

const buttonActive = document.querySelector(".active");
buttonActive.addEventListener('click', toDo.changeStatusActive.bind(toDo));

document.addEventListener('DOMContentLoaded', toDo.renderTaskList.bind(toDo));



function createPopupModal() {
  const popupOpenLink = document.querySelector('.popup__link');
  const popupCloseIcon = document.querySelector('.close-popup');

  popupOpenLink.addEventListener('click', function (e) {
      popupOpen();
  })

  popupCloseIcon.addEventListener('click', function (e) {
      popupClose();
  });

  document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
          popupClose();
      }
  });
}


function popupOpen() {
  const currentPopup = document.querySelector('#popupAchive');

  if (currentPopup) {
      const popupActive = document.querySelector('#popupAchive.open');

      if (popupActive) {
          popupClose();
      } else {
          bodyLock();
      }

      currentPopup.classList.add('open');
  }
}


function popupClose() {
  const popupActive = document.querySelector('#popupAchive.open');
  bodyUnLock()


  popupActive.classList.remove('open');
}

function bodyLock() {
  const body = document.querySelector('body');

  body.classList.add('lock');
}

function bodyUnLock() {
  const body = document.querySelector('body');

  body.classList.remove('lock');
}

createPopupModal()

// function emae () {
//   const userData = localStorage.getItem('userData');
//   if (!userData) {
//     document.querySelector('.noContent').style.visibility = 'visible'
//   } else {
//     document.querySelector('.noContent').style.visibility = 'hidden'
//   }
// }
// emae()
