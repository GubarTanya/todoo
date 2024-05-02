Vue.component('create-card', {
    template: `
    <div>
        <div class="colums">
            <div class="create-card">
                <h1>Добавить карточку:</h1>
                
                <label for="task-name">Название заметки</label>
                <input v-model="title" type="text">     
                
                <div class="tasks-list" v-for="task in tasks">   <!-- отоброжает поля задач  -->
                    <div class="task">
                        <input :value="task.name" @input="event => task.name = event.target.value"/> <!-- :value = "task.name" передаёт значение name из массива tasks для каждого task; @input? для чего, что делает, как называется -->
                        <button  class="dell" @click="deleteTask(task.id)">Удалить</button> <!-- Удаляет задачу по id -->
                    </div>
                </div>

                <div class="butons">
                    <button class="task_add" @click="addTask">+</button>
                    <button class="card_add" @click="addCard">Добавить карточку в таблицу</button>
                </div>
            </div>
                <div class="colum_1">
                    <div class="card" v-for="card in cards" v-if="card.column == 0">
                        <h2>{{card.title}}</h2>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="cardBlocking(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="colum_2">
                    <div class="card" v-for="card in cards" v-if="card.column == 1">
                        <h2>{{card.title}}</h2>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="cardBlocking(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="colum_3">
                    <div class="card" v-for="card in cards" v-if="card.column == 2">
                        <h2>{{card.title}}</h2>
                        <p>Время: {{card.date}}</p>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="cardBlocking(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    `,

    data() {
        return {
            title: "",
            tasks: [
                { id: "0", name: "Задание 1", done: false },
                { id: "1", name: "Задание 2", done: false },
                { id: "2", name: "Задание 3", done: false },
            ],
            cards: [],
        };
    },

    created() {
        this.cards = JSON.parse(localStorage.getItem('cards')) || [];
    },

    methods: {
        deleteTask(id) {
            if (this.tasks.length === 3) {     
                alert("Нельзя удалить задачу, в листе может быть только от 3 задач");
                return;
            }

            for (let i = 0; i < this.tasks.length; i++) { 
                if (this.tasks[i].id == id) {
                    this.tasks.splice(i, 1);
                }
            }
        },
        addTask() {
            if (this.tasks.length > 4) {
                alert("Нельзя добавить больше 5 задач в одну карточку");
                return;
            }

            this.tasks.push({
                id: this.tasks.length + 1,
                name: "Новая задача",
                done: false
            });
        },
        addCard() {
            let cardItem = {
                id: this.cards.length + 1,
                title: this.title,
                tasks: this.tasks,
                column: 0
            };
        
            //считаем кол-во карт в первой колонке
            let firstColumnCards = 0;
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].column == 0) {
                    firstColumnCards++;
                }
            }
        
            //считаем кол-во карт во второй колонке
            let secondColumnCards = 0;
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].column == 1) {
                    secondColumnCards++;
                }
            }
        
            if (firstColumnCards >= 3) {
                alert("Вы использовали максимальное количество карт в 1 колонке");
                return;
            }
        
            if (secondColumnCards >= 6   && cardItem.column == 0) {
                alert("Создание карточек в первой колонке заблокировано, так как во второй колонке уже 5 карточек.");
                return;
            }
        
            this.cards.push(cardItem);
        
            // записываем карточки в локал стор
            localStorage.setItem('cards', JSON.stringify(this.cards));
        
            // занулить данные формы
            this.title = "";
            this.tasks = [
                { id: "0", name: "Задача 1", done: false },
                { id: "1", name: "Задача 2", done: false },
                { id: "2", name: "Задача 3", done: false },
            ];
        },
        cardBlocking(cardId, taskId) {
            // блокирование карт из 1 столбца при 5 картах во втором
            let firstColumnCards = 0;
            let secondColumnCards = 0;
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].column == 0) {
                    firstColumnCards++;
                    if (secondColumnCards >= 5) {
                        console.log("Создание карточек в первой колонке заблокировано, так как во второй колонке уже 5 карточек.");
                        break;
                    }
                }
                if (this.cards[i].column == 1) {
                    secondColumnCards++;
                }
            }

            let currentCard;
                for (let i = 0; i < this.cards.length; i++) {
                    if (this.cards[i].id == cardId) {
                        currentCard = this.cards[i];
                        break;
                    }
                }

            //считаем кол-во выполненых задач в текущей карте
            let doneTasks = 0;
            let globalCurrentTask = {}; // строчка которую мы тыкнули
            for (let i = 0; i < currentCard.tasks.length; i++) {
                let currentTask = currentCard.tasks[i];
                if (currentTask.id == taskId) {
                    currentTask.done = true;
                    // записываем карточки в локал сторе
                    localStorage.setItem('cards', JSON.stringify(this.cards));
                    globalCurrentTask = currentTask;
                }
                if (currentCard.tasks[i].done) {
                    doneTasks++;
                }
            }

            let halfDoneTasks = doneTasks / currentCard.tasks.length;
            if (firstColumnCards == 3 && secondColumnCards == 5 &&
                currentCard.column == 0 && halfDoneTasks >= 0.5)
            {
                globalCurrentTask.done = false;
                alert("Освободите место во второй колонке");
                // записываем карточки в локал сторе
                localStorage.setItem('cards', JSON.stringify(this.cards));
                return;
            }

            // если задание выполнено на 100% то переносим в 3 столбец 
            if (currentCard.column == 1 && doneTasks == currentCard.tasks.length) {
                currentCard.column = 2;
                // записываем карточки в локал сторе
                localStorage.setItem('cards', JSON.stringify(this.cards));
                return;
            }

            // переносим карточку во второй столбец если кол-во выполненных заданий > 50%
            if (halfDoneTasks >= 0.5) {
                if (secondColumnCards == 5) {
                    globalCurrentTask.done = false;
                    alert("Максимальное количество карт во втором столбце");
                    // записываем карточки в локал сторе
                    localStorage.setItem('cards', JSON.stringify(this.cards));
                    return;
                }
                currentCard.column = 1;
                let date = new Date();
                let options = { weekday: 'long', year: 'numeric', month: 'long', 
                    day: 'numeric', hour: 'numeric', minute:'numeric', second: 'numeric'};
                currentCard.date = date.toLocaleDateString('ru', options);
                // записываем карточки в локал сторе
                localStorage.setItem('cards', JSON.stringify(this.cards));
            }
        }
    }
});

let app = new Vue({
    el: '#app',
});