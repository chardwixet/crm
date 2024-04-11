(()=>{

  //для теста
  const clientsList = [
    // {surname: "Кузнецов", name: "Василий", lastName: "Алексеевич", contacts: [{type: 'phone', value: '+71234567890'},{type: 'email',value: 'abc@xyz.com'},{type: 'vk',value: 'id/123131415'},{type: 'facebook',value: 'eqrqt'},{type: 'phone', value: '+71234567890'},{type: 'email',value: 'abc@xyz.com'},{type: 'another',value: 'id/123131415'},{type: 'another',value: 'eqrqt'}]},
    // {surname: "Валиева", name: "Диана", lastName: "Антониновна", contacts: [{type: 'phone', value: '+71234567890'},{type: 'email',value: 'abc@xyz.com'},{type: 'vk',value: 'id/123131415'},{type: 'facebook',value: 'eqrqt'}]},
    // {surname: "Ермилов", name: "Харитон", lastName: "Сидорович", contacts: [{type: 'phone', value: '+71234567890'},{type: 'email',value: 'abc@xyz.com'}]},
    // {surname: "Кузнецов", name: "Степан", lastName: "Алексеевич", contacts: [{type: 'phone', value: '+71234567890'},{type: 'email',value: 'abc@xyz.com'}]},
    // {surname: "Осинова", name: "Алина", lastName: "Марковна", contacts: [{type: 'phone', value: '+71234567890'},{type: 'email',value: 'abc@xyz.com'}]}
  ]

  function autocomplete(selector, data) {

    const inputs = [selector];

    inputs.forEach(input => {

      input.classList.add('autocomplete-input');
      const wrap = document.createElement('div');
      wrap.classList.add('autocomplete-wrap');
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      const list = document.createElement('div');
      list.classList.add('autocomplete-list');
      wrap.appendChild(list);

      let matches = [];
      let listItems = [];
      let focusedItem = -1;

      function setActive(active = true) {
        if(active)
          wrap.classList.add('active');
        else
          wrap.classList.remove('active');
      }

      function focusItem(index) {
        if(!listItems.length) return false;
        if(index > listItems.length - 1) return focusItem(listItems.length - 1);
        if(index < 0) return focusItem(listItems.length - 1);
        focusedItem = index;
        unfocusAllItems();
        listItems[focusedItem].classList.add('focused');
      }

      function smoothScroll(item){
        item.scrollIntoView({
            behavior: 'smooth'
        });
    }

      function getBackgroundTable(dataItem) {

        console.log('зашло в перес')
        const tableItems = document.querySelectorAll('.hero-table__row');

        tableItems.forEach((item) => {

          const tableItem = item.querySelector('.hero-table__col--2');

          if(dataItem !== tableItem.textContent){
            tableItem.classList.add('hero-table__row--background');
            smoothScroll(tableItem);
          }

        })
      }

      function deleteBackgroundTable() {

        console.log('зашло в перес')
        const tableItems = document.querySelectorAll('.hero-table__row');

        tableItems.forEach((item) => {

          console.log('зашло в ')
          const tableItem = item.querySelector('.hero-table__col--2');

          tableItem.classList.remove('hero-table__row--background')


        })

      }

      function unfocusAllItems() {
        listItems.forEach(item => {
            item.classList.remove('focused');
        })
      }

      function selectItem(index) {
        if(!listItems[index]) return false;

        input.value = listItems[index].textContent;
        setActive(false);

        getBackgroundTable(listItems[index].textContent);
        console.log(listItems[index]);
      }

      response = data;

      input.addEventListener('input', async () => {
        console.log('пытаюсь зайти в функцию')
        deleteBackgroundTable();
        const value = input.value;

        if(value === '') list.innerHTML = '';
        if(!value) return setActive(false);

        list.innerHTML = '';
        listItems = [];

        if(value.length === 1) {
          let response = await fetch('http://localhost:3000/api/clients');
          response = await response.json();
        }
        let count = 0;

        response.forEach((dataItem, index) => {

          // let search = ciSearch(value, dataItem);
          // if(search === -1) return false;
          matches.push(index);

          let surname = '';
          let name = '';
          let lastName = '';

          const spaceCount = (value.split(" ").length - 1);


          dataRes = `${dataItem.surname} ${dataItem.name} ${dataItem.lastName}`;



          result = srav(dataRes, value)




          function srav(dataItem, value) {

            let result ='';
            let res = '';

              if(dataItem.length >= value.length) {

                for(let i = 0; i < value.length; i++) {

                    let temp = '';

                    if(dataItem[i].toLowerCase() === value[i].toLowerCase()) {

                      temp = value[i];
                      result = result + dataItem[i];
                    }

                    if(temp === '' && result !== '') {
                      result = '';
                      break;
                    }

                    if(temp === '')
                      break;

                  }


                }
              else
                result = '';





            // res.sort( (a, b) => {return ('' + b).localeCompare(a)});

            // if(valueParts){
            //   value = '';
            //   valueParts.forEach((parts)=>{
            //     value = value +' ' + parts;
            //   })
            // }

            return result;

          }

          function part(dataItem, item) {
            let res = ''
            res = dataItem.substr(item.length);
            return res;
          }



          console.log(result);

          const resultPart = part(dataRes, result);


          // let parts = [
          //   dataItem.substr(0, search),
          //   dataItem.substr(search, value.length),
          //   dataItem.substr(search + value.length, dataItem.length - search - value.length)
          // ];

          const item = document.createElement('div');
          item.classList.add('autocomplete-item');
          item.innerHTML = `<strong>${result}</strong>${resultPart}`;
          if(result){
            list.appendChild(item);
            listItems.push(item);
            item.id = count;
            count++;
          }

          item.addEventListener('mousemove', (e) => {

            focusedItem = item.id;
            console.log('focusedItem',focusedItem);
            focusItem(focusedItem);

          });

          item.addEventListener('click', () => {
            selectItem(listItems.indexOf(item));
          })
        });

        if(listItems.length > 0)
          setActive(true);
        else
          setActive(false);
      });

      input.addEventListener('keydown', (e) => {

        if(e.key === 'ArrowDown' || e.key === 'Tab') {//arrow down or tab
          e.preventDefault();
          focusedItem++;

          focusItem(focusedItem);
        } else if(e.key === 'ArrowUp' || e.shiftKey && e.key === 'Tab' ) { //arrow up or shift + tab
          e.preventDefault();
          if(focusedItem > 0) focusedItem--;
          focusItem(focusedItem);
        } else if(e.key === "Escape") { //escape
          setActive(false);
        } else if(e.key === "Enter") { // enter
          e.preventDefault();
          selectItem(focusedItem);
        }
      });

      document.body.addEventListener('click', (e) => {
        if(!wrap.contains(e.target)) setActive(false);
      });

    });

  }

  function maskContact (){[].forEach.call(
    document.querySelectorAll('.modal-contacts__input'), function(input) {

    let keyCode;


    function mask(event) {


      if(this.classList.contains('tel')){
        event.keyCode && (keyCode = event.keyCode);
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        let matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        let reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
          this.value = new_value;
        }
        if (event.type == "blur" && this.value.length < 5) {
          this.value = "";
        }
      }
      else {



          input.removeEventListener("input", mask, false);
          input.removeEventListener("focus", mask, false);
          input.removeEventListener("blur", mask, false);
          input.removeEventListener("keydown", mask, false);

      }
    }

      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false);
    }
  )}

  function fadeIn (el) {

    el.style.opacity = 0;
    el.style.transition = `opacity 400ms`;
    setTimeout(() => {
      el.style.opacity = 1;
    }, 10);
  };

  function fadeOut (el) {
    el.style.opacity = 1;
    el.style.transition = `opacity 400ms`;
    el.style.opacity = 0;

    setTimeout(() => {
      el.remove();
    }, 200);
  };

  function validation(item) {


    let errorEmpty = '';
    let temp ='';
    let mailValid = '';

    const arrItem = [item.nameInput, item.surnameInput, item.lastNameInput];

    const label = document.querySelectorAll('label');

    function validMail() {
      var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
      var myMail = document.querySelector('.email').value;

      var valid = re.test(myMail);
      let output = '';
      if (valid) output = '';
      else output = 'Адрес электронной почты введен неправильно';

      return output;
    }



    label.forEach((el)=>{
      const titleSpan = el.querySelector('.modal__input-title');
      const input = el.querySelector('input');
      const select = el.querySelector('select');



      if(!titleSpan){

        switch (select.value){
          case 'phone':
            title = 'Телефон';
            break;

          case 'email':
            mailValid = validMail()

            title = 'Email';
            break;

          case 'vk':
            title = 'Vk';
            break;

          case 'facebook':
            title = 'Facebook';
            break;

        }


      }
      else
        title = titleSpan.textContent

      if(input.value.trim() === '' && title != 'Отчество'){
        if(title === 'Email')
          mailValid = '';

        temp = temp + `"${title}" `;
        errorEmpty = `Не заполнено пустое поле ${temp}`;
      }
    });



    return {errorEmpty, mailValid};
  }

  async function post(item){
   const status = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: item.name,
        surname: item.surname,
        lastName: item.lastName,
        contacts: item.contacts
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    return status;
  }

  async function checkstatus(status, modal, overlay, errorServer, errorSpan, nameValue, surnameValue, lastNameValue) {
    switch(status) {
      case 404:
        errorServer = 'Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных'
        break;

      case 422:
        errorServer = 'Объект, переданный в теле запроса, не прошёл валидацию';
        break;

      case 500:
        errorServer = 'Странно, но сервер сломался :('
        break;

      case 201:
      case 200:
        errorServer = '';
        break;

      default:
        errorServer = 'Что то пошло не так...';
        break;
    }

    console.log(errorServer)

    if(errorServer === ''){
      console.log('всё ок, зашли в if');

      let response = await fetch('http://localhost:3000/api/clients');
      response = await response.json();



      renderClients(response);

      if(nameValue)
        nameValue = '';

      if(surnameValue)
        surnameValue = '';

      if(lastNameValue)
        lastNameValue = '';


      console.log('пытаюсь закрыть клозалмодал')
      closeModal(modal, overlay);
    }
    else {
      console.log('else зашли')
      errorSpan.textContent = errorServer;
    }
  }

  async function saveServer(option, item){

    let methodLink

    if(option === 'POST')
      methodLink =  'http://localhost:3000/api/clients';

    if(option === 'PATCH')
      methodLink =  `http://localhost:3000/api/clients/${item.id}`;

    const status = await fetch(methodLink, {
      method: option,
      body: JSON.stringify({
        name: item.name,
        surname: item.surname,
        lastName: item.lastName,
        contacts: item.contacts
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    return status;

  }

  async function saveButton(saveOption, loaderSave, modal, overlay, errorSpan, errorMailSpan, nameInput, surnameInput, lastNameInput, id) {

    const name = nameInput.value;
    const surname = surnameInput.value;
    const lastName = lastNameInput.value;


    const contacts = [];
    const label = document.querySelectorAll('.modal-contacts__label');
    const buttonSave = document.querySelector('.modal__btn');

    console.log('loader в savebut',loaderSave)

    label.forEach((item)=>{
      const select = item.querySelector('select');
      const input = item.querySelector('input');
      contacts.push({type: select.value, value: input.value});
    })

    let item =  {name, surname, lastName, contacts};



    if(id)
      item.id = id;

    const saveSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clip-path="url(#clip0_121_1254)">
        <path d="M3.00008 8.03996C3.00008 10.8234 5.2566 13.08 8.04008 13.08C10.8236 13.08 13.0801 10.8234 13.0801 8.03996C13.0801 5.25648 10.8236 2.99996 8.04008 2.99996C7.38922 2.99996 6.7672 3.1233 6.196 3.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_121_1254">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>`



    const errorText = validation({nameInput, surnameInput, lastNameInput});

    console.log('knopka', buttonSave)

    if(errorText.errorEmpty === '' && errorText.mailValid === ''){

      console.log(loaderSave);

      loaderSave.classList.add('loader', 'save-loader');
      loaderSave.innerHTML = saveSvg;

      const serverStatus = await saveServer(saveOption, item);
      let errorServer = '';

      console.log(serverStatus);
      console.log('пошла жара', serverStatus.status);

      checkstatus(serverStatus.status, modal, overlay, errorServer, errorSpan, nameInput.value, surnameInput.value, lastNameInput.value)

      loaderSave.innerHTML = '';
      loaderSave.classList.remove('loader', 'save-loader');


    }
    else {
      console.log('зашло в ошибки')
      if(errorText.errorEmpty)
      errorSpan.textContent = errorText.errorEmpty;


      if(errorText.mailValid){
        errorMailSpan.textContent = errorText.mailValid;
      }
    }

  }

  function closeModal(modal, overlay) {

    fadeOut(modal);
    fadeOut(overlay);

    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search)
    }
  }

  function modalWindow() {



    const hero = document.querySelector('.hero');
    const modal = document.createElement('div');
    const overlay = document.createElement('div');
    const titleSpan = document.createElement('span');
    const errorSpan = document.createElement('span');
    const button = document.createElement('button');
    const buttonEx = document.createElement('button');
    const buttonCancel = document.createElement('button');

    const loaderSave = document.createElement('span');

    const buttonExSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2332 7.73333L21.2665 6.76666L14.4998 13.5334L7.73318 6.7667L6.76652 7.73336L13.5332 14.5L6.76654 21.2667L7.73321 22.2333L14.4998 15.4667L21.2665 22.2334L22.2332 21.2667L15.4665 14.5L22.2332 7.73333Z" fill="#B0B0B0"/>
    </svg>`


    buttonEx.innerHTML = buttonExSvg;


    button.textContent = 'Сохранить';
    buttonCancel.textContent = 'Отмена';

    button.prepend(loaderSave);
    modal.classList.add('modal');
    overlay.classList.add('overlay');
    errorSpan.classList.add('modal__error');
    button.classList.add('btn', 'modal__btn', 'btn-reset');
    buttonEx.classList.add('modal__btn-close','btn-reset');
    buttonCancel.classList.add('modal__btn-cancel','btn-reset');
    titleSpan.classList.add('modal__title');



    modal.append(button);
    modal.append(buttonEx);
    modal.append(buttonCancel);
    // button.disabled = true;



    overlay.id = 'overlay';


    hero.append(overlay);
    fadeIn(overlay);


    overlay.addEventListener('click', ()=>{
      closeModal(modal, overlay)
    })

    buttonEx.addEventListener('click', ()=>{
      closeModal(modal, overlay)
    })



    return {
      modal,
      overlay,
      button,
      titleSpan,
      buttonCancel,
      errorSpan,
      loaderSave
    };
  }

  function Form(heigh, clientContacts) {

    const {modal, overlay, button, titleSpan, buttonCancel, errorSpan, loaderSave} = modalWindow();

    const form = document.createElement('form');
    const nameLabel = document.createElement('label');
    const surnameLabel = document.createElement('label');
    const lastnameLabel = document.createElement('label');

    const errorMailSpan = document.createElement('span');
    const contentTitle = document.createElement('div');

    const nameSpan = document.createElement('span');
    const surnameSpan = document.createElement('span');
    const lastnameSpan = document.createElement('span');
    const contactsSpan = document.createElement('span');
    const contactsSpanSvg = document.createElement('span');
    const contactsSpanText = document.createElement('span');
    const starSpan = document.createElement('span');
    const starSpan2 = document.createElement('span');

    const nameInput = document.createElement('input');
    const surnameInput = document.createElement('input');
    const lastNameInput = document.createElement('input');

    const buttonContacts = document.createElement('button');

    const buttonContactsSvg = `
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="6.25" fill="none" stroke="none" stroke-width="1.5"/>
      <rect x="4" y="6.80029" width="7" height="1.5" rx="0.75" fill="none"/>
      <rect x="6.80005" y="11" width="7" height="1.5" rx="0.75" transform="rotate(-90 6.80005 11)" fill="none"/>
    </svg>`;

    contactsSpanSvg.innerHTML = buttonContactsSvg;

    nameSpan.innerHTML = 'Имя';
    surnameSpan.textContent = 'Фамилия';
    lastnameSpan.textContent = 'Отчество';
    contactsSpanText.textContent = 'Добавить контакт';
    titleSpan.textContent = 'Новый клиент';

    form.classList.add('modal__form');
    modal.classList.add('modal--gray-back');

    nameLabel.classList.add('modal__input-box');
    surnameLabel.classList.add('modal__input-box');
    lastnameLabel.classList.add('modal__input-box');

    nameInput.classList.add('modal__input');
    surnameInput.classList.add('modal__input');
    lastNameInput.classList.add('modal__input');

    contentTitle.classList.add('modal__content-title');
    nameSpan.classList.add('modal__input-title', 'modal__input-title--name', 'placeholder');
    surnameSpan.classList.add('modal__input-title', 'modal__input-title--surname', 'placeholder');
    lastnameSpan.classList.add('modal__input-title', 'modal__input-title--lastname', 'placeholder');
    contactsSpan.classList.add('modal__container-btn');
    contactsSpanSvg.classList.add('modal__svg');
    starSpan.classList.add('modal__title-svg');
    starSpan2.classList.add('modal__title-svg');

    errorMailSpan.classList.add('modal__error');

    buttonContacts.classList.add('modal__btn-contacts','btn-reset');

    modal.prepend(form);
    form.append(contentTitle);
    contentTitle.append(titleSpan)
    form.append(surnameLabel);
    surnameLabel.append(surnameInput);
    surnameLabel.append(surnameSpan);
    surnameSpan.append(starSpan);

    form.append(nameLabel);
    nameLabel.append(nameInput);
    nameLabel.append(nameSpan);
    nameSpan.append(starSpan2);

    form.append(lastnameLabel);
    lastnameLabel.append(lastNameInput);
    lastnameLabel.append(lastnameSpan);

    form.append(contactsSpan);
    buttonContacts.append(contactsSpanSvg);
    buttonContacts.append(contactsSpanText);
    contactsSpan.append(buttonContacts);

    form.append(errorSpan);
    form.append(errorMailSpan);

    form.addEventListener('input',()=>{

      checkValueInput({nameInput, nameSpan, surnameInput, surnameSpan, lastNameInput, lastnameSpan});

    });

    buttonCancel.addEventListener('click', ()=>{
      closeModal(modal, overlay)
    });

    hero.append(modal);
    fadeIn(modal);

    let top = modal.offsetHeight;

    function topValue(top) {
      if(top === 409)
          top = 268;

        if(top === 379)
          top = 252;

        return top;
    }
    top = topValue(top);

    modal.style.setProperty('--top', top + 'px');
    modal.style.setProperty('--temp-top', top + 'px');





    console.log('только запустилось',top);

    const contactContainer = document.createElement('div');
    contactContainer.classList.add('modal-contacts__content')
    contactsSpan.prepend(contactContainer);
    let count = 0;
    let temp;

    function contactsForm(client, top) {


      const labelContact = document.createElement('label');
      // добавление выбора типов контактов
      const select = document.createElement('select');

      const vkOption = document.createElement('option');
      const phoneOption = document.createElement('option');
      const facebookOption = document.createElement('option');
      const emalOption = document.createElement('option');
      const otherOption = document.createElement('option');
      const div = document.createElement('div');

      const buttonDelete = document.createElement('button');

      buttonDelete.classList.add('hero-table__delete-content');

      const svgDelete = document.createElement('span');

      svgDelete.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="none"/>
      </svg>`

      buttonDelete.append(svgDelete);

      vkOption.value = 'vk';
      phoneOption.value = 'phone';
      facebookOption.value = 'facebook';
      emalOption.value = 'email';
      otherOption.value = 'another';

      phoneOption.textContent = 'Телефон';
      vkOption.textContent = 'Вк';
      facebookOption.textContent = 'Facebook';
      emalOption.textContent = 'Email';
      otherOption.textContent = 'Другое';

      select.append(phoneOption);
      select.append(vkOption);
      select.append(facebookOption);
      select.append(emalOption);
      select.append(otherOption);

      labelContact.classList.add('modal-contacts__label');
      select.classList.add('modal-contacts__type');
      div.classList.add('modal-contacts__wrapper');
      buttonDelete.classList.add('modal-contacts__btn-delete', 'btn-reset');

      div.append(select);
      labelContact.append(div);


      const contactItemInput = document.createElement('input');
      const buttonContacts = document.querySelector('.modal__btn-contacts');


      // подбор высоты фона контактов
      if(heigh === 35){

        heigh = heigh + 70;
        temp = heigh;
      }
      else {
        heigh = heigh + 52;
        temp = heigh;

      }

      //максимальная высота фона
      if(heigh > 159){
        temp = 159;
      }

      function selectCheck(select) {
        switch(select.value){

          case 'email':
            contactItemInput.classList.add('email');
            contactItemInput.classList.remove('tel');
            contactItemInput.placeholder = 'abc@abc.ru';
            break;

          case 'phone':
            contactItemInput.classList.remove('email');
            contactItemInput.classList.add('tel');
            contactItemInput.placeholder = '+7 (___) ___-__-__';
            maskContact();
            break;

          case 'vk':
            contactItemInput.placeholder = 'vk.com/id12341';
            contactItemInput.classList.remove('tel');
            contactItemInput.classList.remove('email');
            break;

          case 'facebook':
            contactItemInput.placeholder = '';
            contactItemInput.classList.remove('tel');
            contactItemInput.classList.remove('email');
            break;

          case 'another':
            contactItemInput.placeholder = '';
            contactItemInput.classList.remove('tel');
            contactItemInput.classList.remove('email');
            break;

        }
      }




      if(count === 10) {
        temp = temp - 35;
      }
      count++;

      console.log('рядом с топ',top)

      const tempoTop = modal.style.getPropertyValue('--temp-top');
      console.log('top', top);


      function topSlice(top) {
        top = top - 29;
        return top;
      }

      if(tempoTop === top + 'px')
        top = topSlice(top);

      modal.style.setProperty('--top', top + 'px');
      modal.style.setProperty('--heigh', temp + 'px');



      contactItemInput.classList.add('modal-contacts__input');



      labelContact.append(contactItemInput);

      contactContainer.append(labelContact);
      maskContact();



      if(client) {
        contactItemInput.value = client.value;
        select.value = client.type;
        labelContact.append(buttonDelete);
      }

      selectCheck(select);

      select.addEventListener('change', ()=>{


        contactItemInput.value = '';

        selectCheck(select);
      })

      labelContact.addEventListener('input', ()=>{
          if(contactItemInput.value) {
            labelContact.append(buttonDelete);
          }
          else {
            buttonDelete.remove()
          }
      });

      buttonDelete.addEventListener('click',(e)=>{
        e.preventDefault();

        if (heigh === 35 + 70) {
          heigh = heigh - 70;
          temp = heigh;
          modal.style.setProperty('--top', tempoTop);

        }
        else {
          heigh = heigh - 52;
          temp = heigh;
        }

        if(heigh > 159)
          temp = 159;


        if(count === 10){

          buttonContacts.classList.toggle('modal__btn-contacts');
          buttonContacts.classList.toggle('none');
        }
        modal.style.setProperty('--heigh', temp + 'px');

        count--;


        labelContact.remove();
      })


    }

    if(clientContacts) {
      for(let i = 0; i < clientContacts.length; i++){
        contactsForm(clientContacts[i], top);
      }
    }

// добавление контакта
    buttonContacts.addEventListener('click',(e)=>{
      e.preventDefault();

      contactsForm('', top);
      if(count === 10) {
        temp = temp - 40;

        modal.style.setProperty('--heigh', temp + 'px');
        buttonContacts.classList.toggle('modal__btn-contacts');
        buttonContacts.classList.toggle('none');
      }
    })



    return {
      modal,
      form,
      titleSpan,
      contentTitle,
      buttonContacts,
      buttonCancel,
      contactContainer,
      button,
      nameInput,
      surnameInput,
      lastNameInput,
      nameSpan,
      surnameSpan,
      lastnameSpan,
      overlay,
      errorSpan,
      errorMailSpan,
      loaderSave
    }
  }

  function createItemForm() {

    let heigh = 35;
    const {
      modal,
      form,
      titleSpan,
      button,
      nameInput,
      surnameInput,
      lastNameInput,
      nameSpan,
      surnameSpan,
      lastnameSpan,
      overlay,
      errorSpan,
      errorMailSpan,
      loaderSave
    } = Form(heigh, '');



    button.addEventListener('click', async (e)=>{

      e.preventDefault();
      saveButton('POST', loaderSave, modal, overlay, errorSpan, errorMailSpan, nameInput, surnameInput, lastNameInput);

    })




    return {
      modal,
      form,
      nameInput,
      surnameInput,
      lastNameInput,
      overlay
    };
  }

  function checkValueInput(modal) {

    if(modal.nameInput.value !== '')
      modal.nameSpan.classList.add('placeholder--value');
    else
      modal.nameSpan.classList.remove('placeholder--value');

    if(modal.surnameInput.value !== '')
      modal.surnameSpan.classList.add('placeholder--value');
    else
      modal.surnameSpan.classList.remove('placeholder--value');

    if(modal.lastNameInput.value !== '')
      modal.lastnameSpan.classList.add('placeholder--value');
    else
      modal.lastnameSpan.classList.remove('placeholder--value');

  }

  function changeItemForm(client) {

    console.log(client)

    let heigh = 35;


    const objectModal = Form(heigh, client.contacts);


    objectModal.titleSpan.textContent = 'Изменить данные';

    objectModal.surnameInput.value = client.surname;
    objectModal.nameInput.value = client.name;
    objectModal.lastNameInput.value = client.lastName;

    const spanTitle = document.createElement('span');

    spanTitle.textContent = `ID: ${client.id}`;
    spanTitle.classList.add('modal__title-id');

    checkValueInput(objectModal);

    objectModal.contentTitle.append(spanTitle);

    objectModal.buttonCancel.textContent = 'Удалить клиента';

    console.log('loader',objectModal.loaderSave)

    objectModal.button.addEventListener('click', async(e)=>{

      e.preventDefault;

      saveButton('PATCH', objectModal.loaderSave, objectModal.modal, objectModal.overlay, objectModal.errorSpan, objectModal.errorMailSpan, objectModal.nameInput,
        objectModal.surnameInput, objectModal.lastNameInput, client.id);

    })

    objectModal.buttonCancel.addEventListener('click', async(e)=>{
      e.preventDefault();

      console.log('запустил удаление')

      const modal = await modalDelete(client.id)
      hero.append(modal);
      fadeIn(modal);
    })

    maskContact();

    return objectModal.modal;
  }

  async function modalDelete(id, deleteSvg, deleteBtn, deleteSvgImage) {

    let client = await fetch(`http://localhost:3000/api/clients/${id}`);
    client = await client.json();

    if(deleteSvg && deleteBtn && deleteSvgImage){
      deleteSvg.classList.remove('delete-loader');
      deleteBtn.classList.remove('hero-table__btn-delete--red');
      deleteSvg.innerHTML = deleteSvgImage;
    }
    const {loaderSave, modal, overlay, button, titleSpan, buttonCancel, errorSpan} = modalWindow();

    button.textContent = 'Удалить';
    button.prepend(loaderSave);
    const span = document.createElement('span');

    titleSpan.classList.add('modal__title--center');
    span.classList.add('modal__text');

    titleSpan.textContent = "Удалить клиента"
    span.textContent = `Вы действительно хотите удалить данного клиента?`;
    // button.textContent = 'Удалить';

    modal.prepend(errorSpan)
    modal.prepend(span);
    modal.prepend(titleSpan);


    buttonCancel.addEventListener('click', ()=>{
      closeModal(modal, overlay)
    })

    button.addEventListener('click', async (e)=>{
      e.preventDefault;

      const saveSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clip-path="url(#clip0_121_1254)">
            <path d="M3.00008 8.03996C3.00008 10.8234 5.2566 13.08 8.04008 13.08C10.8236 13.08 13.0801 10.8234 13.0801 8.03996C13.0801 5.25648 10.8236 2.99996 8.04008 2.99996C7.38922 2.99996 6.7672 3.1233 6.196 3.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
          </g>
          <defs>
            <clipPath id="clip0_121_1254">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>`
      loaderSave.classList.add('loader', 'save-loader');
      loaderSave.innerHTML = saveSvg;

      const deleteItem = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
      });

      let errorServer = '';



      checkstatus(deleteItem.status, modal, overlay, errorServer, errorSpan);

      loaderSave.innerHTML = '';
      loaderSave.classList.remove('loader', 'save-loader');

    })

    return modal;
  }

  function dateConvert(item) {
    item = new Date(item);
    const date = item.toLocaleDateString();
    let time = item.toLocaleTimeString().split(':');
    time = `${time[0]}:${time[1]}`;
    return {date, time};
  }

  function getSvg(item){

    const contactSpanSvg = document.createElement('span');
    const contactSpanIcon = document.createElement('span');
    const contactSpan = document.createElement('span');
    const contactBtn = document.createElement('btn');
    contactSpanIcon.classList.add('hero-table__svg-icon');
    contactSpanSvg.classList.add('hero-table__svg');
    contactSpan.classList.add('hero-table__hint');
    contactBtn.classList.add('hero-table__svg-btn');
    contactSpanSvg.append(contactBtn, contactSpan);
    contactBtn.append(contactSpanIcon);




    // svg phone
    const phone =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g opacity="0.7">
        <circle cx="8" cy="8" r="8" fill="#9873FF"/>
        <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
      </g>
    </svg>`;

    // svg facebook
    const facebook =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g opacity="0.7">
        <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
      </g>
    </svg>`;

    // svg mail
    const mail =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
    </svg>`;

    // svg vk
    const vk =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g opacity="0.7">
        <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
      </g>
    </svg>`;

    // another
    const another =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
    </svg>`;

    switch(item.type){

      case 'phone':

        contactSpanIcon.innerHTML = phone;
        contactSpan.innerHTML = `Телефон: <b> ${item.value} </b>`;
        return {contactSpanSvg, contactBtn, contactSpan};


      case 'email':
        contactSpanIcon.innerHTML = mail;
        contactSpan.innerHTML = `Email: <b>${item.value}</b>`;
        return {contactSpanSvg, contactBtn, contactSpan};


      case 'vk':
        contactSpanIcon.innerHTML = vk;
        contactSpan.innerHTML = `VK: <b> ${item.value} </b>`;
        return {contactSpanSvg, contactBtn, contactSpan};


      case 'facebook':
        contactSpanIcon.innerHTML = facebook;
        contactSpan.innerHTML = `Facebook: <b> ${item.value} </b>`;
        return {contactSpanSvg, contactBtn, contactSpan};


      case 'another':
        contactSpanIcon.innerHTML = another;
        contactSpan.innerHTML = `<b>${item.value}</b>`;
        return {contactSpanSvg, contactBtn, contactSpan};

    }
  }

  async function activationModalChange (changeSvg, changeBtn, changeSvgImage) {



    let temp = `${location.hash}` + '';
    let id = temp.substr(3, )

    console.log(id);

    let client = await fetch(`http://localhost:3000/api/clients/${id}`);
    client = await client.json();

    if(changeSvg && changeBtn && changeSvgImage){
      changeSvg.classList.remove('change-loader');
      changeBtn.classList.remove('hero-table__btn-change--purple');
      changeSvg.innerHTML = changeSvgImage;
    }


    const modal = changeItemForm(client);
    hero.append(modal);
    fadeIn(modal);

  }

  function loaderSvg(itemSvg, itemBtn) {

    if(!itemSvg.classList.contains('change-loader') && !itemBtn.classList.contains('hero-table__btn-change--purple') && itemBtn.classList.contains('hero-table__btn-change')){

      itemSvg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clip-path="url(#clip0_224_2787)">
            <path d="M3.00008 8.04008C3.00008 10.8236 5.2566 13.0801 8.04008 13.0801C10.8236 13.0801 13.0801 10.8236 13.0801 8.04008C13.0801 5.2566 10.8236 3.00008 8.04008 3.00008C7.38922 3.00008 6.7672 3.12342 6.196 3.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
          </g>
          <defs>
            <clipPath id="clip0_224_2787">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>`;

      itemSvg.classList.add('change-loader');
      itemBtn.classList.add('hero-table__btn-change--purple');
    }

    if(!itemSvg.classList.contains('delete-loader') && !itemBtn.classList.contains('hero-table__btn-delete--red') && itemBtn.classList.contains('hero-table__btn-delete')) {
      itemSvg.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g clip-path="url(#clip0_224_2792)">
          <path d="M3.00008 8.04008C3.00008 10.8236 5.2566 13.0801 8.04008 13.0801C10.8236 13.0801 13.0801 10.8236 13.0801 8.04008C13.0801 5.2566 10.8236 3.00008 8.04008 3.00008C7.38922 3.00008 6.7672 3.12342 6.196 3.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        </g>
      <defs>
        <clipPath id="clip0_224_2792">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
      </svg>`;

      itemSvg.classList.add('delete-loader');
      itemBtn.classList.add('hero-table__btn-delete--red');
    }
  }

  function getItem(client){
    const tr = document.createElement('tr');
    const idTableTd = document.createElement('td');
    const fioTd = document.createElement('td');
    const createdAt = document.createElement('td');
    const updatedAt = document.createElement('td');
    const contacts = document.createElement('td');
    const change = document.createElement('td');
    const idTableSpan = document.createElement('span');
    const fioSpan = document.createElement('span');
    const createdDiv = document.createElement('div');
    const createdAtSpanTime = document.createElement('span');
    const updatedDiv = document.createElement('div');
    const updatedAtSpanTime = document.createElement('span');
    const createdAtSpan = document.createElement('span');
    const updatedAtSpan = document.createElement('span');
    const fio = `${client.surname} ${client.name} ${client.lastName}`;
    const actionDiv = document.createElement('div');
    const changeBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    let countItem;
    const countItemBtn = document.createElement('btn');
    let changeSvg = document.createElement('span');
    let deleteSvg = document.createElement('span');
    const changeText = document.createElement('span');
    const deleteText = document.createElement('span');


    idTableSpan.textContent = client.id;
    fioSpan.textContent = fio;
    createdAtSpan.textContent = dateConvert(client.createdAt).date;
    updatedAtSpan.textContent = dateConvert(client.updatedAt).date;
    createdAtSpanTime.textContent = dateConvert(client.createdAt).time;
    updatedAtSpanTime.textContent = dateConvert(client.updatedAt).time;
    changeText.textContent = "Изменить";
    deleteText.textContent = "Удалить";

    const changeSvgImage = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g opacity="0.7" clip-path="url(#clip0_121_2280)">
        <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
      </g>
      <defs>
        <clipPath id="clip0_121_2280">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>`;

    const deleteSvgImage = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g opacity="0.7" clip-path="url(#clip0_121_2468)">
          <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
        </g>
        <defs>
          <clipPath id="clip0_121_2468">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    `
    changeSvg.innerHTML = changeSvgImage;
    deleteSvg.innerHTML = deleteSvgImage;

    actionDiv.classList.add('hero-table__action-container');
    contacts.classList.add('hero-table__contacts');
    changeBtn.classList.add('hero-table__btn-change', 'btn-reset');
    deleteBtn.classList.add('hero-table__btn-delete', 'btn-reset')
    idTableSpan.classList.add('hero-table__text', 'hero-table__text--small', 'hero-table__text--gray');
    fioSpan.classList.add('hero-table__text');
    createdDiv.classList.add('hero-table__container-text');
    createdAtSpan.classList.add('hero-table__text','hero-table__text--margin');
    updatedDiv.classList.add('hero-table__container-text');
    updatedAtSpan.classList.add('hero-table__text','hero-table__text--margin');
    createdAtSpanTime.classList.add('hero-table__text', 'hero-table__text--gray');
    updatedAtSpanTime.classList.add('hero-table__text', 'hero-table__text--gray');
    tr.classList.add('hero-table__row');

    // Удаление клиента
    deleteBtn.addEventListener('click', async (e)=>{
      e.preventDefault();

      loaderSvg(deleteSvg, deleteBtn);

      console.log('пытаюсь удалить');
      const modal = await modalDelete(client.id, deleteSvg, deleteBtn, deleteSvgImage)
      hero.append(modal);
      fadeIn(modal);

    })

    changeBtn.addEventListener('click', (e)=>{
      e.preventDefault();

      loaderSvg(changeSvg, changeBtn);
      console.log(changeSvg)
      location.hash = `id${client.id}`;
      activationModalChange(changeSvg, changeBtn, changeSvgImage);


    })

//contacts svg
    for(const i in client.contacts){
      let {contactSpanSvg, contactBtn, contactSpan} = getSvg(client.contacts[i]);
      contacts.append(contactSpanSvg);
      // contactBtn.addEventListener('focus',()=>{
      //   contactSpan.classList.toggle('none');
      // })
      if(i > 3){
        contactSpanSvg.classList.add('none');
        if(i == client.contacts.length - 1){
          countItem = client.contacts.length - 4;
          countItemBtn.textContent = `+${countItem}`;
          countItemBtn.classList.add('hero-table__btn')
          contacts.append(countItemBtn);
        }
      }
    }



    idTableTd.append(idTableSpan)
    tr.append(idTableTd);
    tr.append(fioTd);
    fioTd.append(fioSpan);
    createdDiv.append(createdAtSpan);
    createdDiv.append(createdAtSpanTime);
    createdAt.append(createdDiv);
    updatedDiv.append(updatedAtSpan);
    updatedDiv.append(updatedAtSpanTime);
    updatedAt.append(updatedDiv);
    changeBtn.append(changeSvg, changeText);
    deleteBtn.append(deleteSvg, deleteText);
    change.append(actionDiv);
    actionDiv.append(changeBtn);
    actionDiv.append(deleteBtn)
    tr.append(createdAt);
    tr.append(updatedAt);
    tr.append(contacts);
    tr.append(change);

    const td = tr.querySelectorAll('td');

    td.forEach((item, index)=> {
      item.classList.add('hero-table__col',`hero-table__col--${index+1}`);
    })



      countItemBtn.addEventListener('click',()=>{
        countItemBtn.classList.add('none');
        const contactBtn = tr.querySelectorAll('.hero-table__svg','.none');

        contactBtn.forEach((item)=>item.classList.remove('none'))

      });



    return tr;
  }

  function sortUsers (arr, prop, dir) {
    return arr.sort((a,b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1)
  }

  function renderClients(clientsArr) {
    const tbody = document.querySelector('.table-hero__tbody');

    const mask = document.querySelector('.mask');



    tbody.innerHTML = '';



    for(const item of clientsArr){
      const tr = getItem(item);
      tbody.append(tr);

    }

    if(mask){
      mask.classList.add('hide');
      setTimeout(() => {
        mask.remove();
      }, 600);
    }

  }

  document.addEventListener('DOMContentLoaded', async ()=>{

    if(location.hash)
    {
      activationModalChange();
    }
    const hero = document.querySelector('.hero__content');
    const th = document.querySelectorAll('.hero-table__dir');
    const dirSpan = document.createElement('span');
    const titleText = document.querySelectorAll('.hero-table__title-text')

    dirSpan.textContent = 'А-Я';
    dirSpan.classList.add('hero-table__dir-text');
    console.log(dirSpan);

    let dir;


    let response = await fetch('http://localhost:3000/api/clients')


    console.log(response.status);

    response = await response.json();
    let search = document.querySelector('.header-form__search')

    autocomplete(search, response);

    if (response.length === 0 && clientsList.length > 0) {
      clientsList.forEach((item) => post(item));
    }

    const dirU = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill=""/>
    </svg>`;

    const dirD = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g opacity="0.7" clip-path="url(#clip0_121_2398)">
        <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill=""/>
      </g>
      <defs>
        <clipPath id="clip0_121_2398">
          <rect width="12" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>`;

    let dirSvg = [];
    for (let i = 0; i < th.length; i++) {
      dirSvg[i] = document.createElement('span');
      if(i === 0){
        dirSvg[i].classList.add('hero-table__dirU');
        dirSvg[i].innerHTML = dirU;
        focuseSort(th[i], dirSvg[i]);
      }
      else {
        dirSvg[i].classList.add('hero-table__dirD');
        dirSvg[i].innerHTML = dirD;
      }

      th[i].append(dirSvg[i]);
    }



    let copyArr = [...response];
    sortUsers(copyArr, 'id', dir);

    renderClients(copyArr);
// Сортировка

function focuseSort(el, dirSvg, dirSpan) {
  console.log('тот самый el', dirSvg);
  const svg = dirSvg.querySelector('svg')
  if(dirSpan)
    dirSpan.id = 'purple';
  el.id = 'purple';
  svg.id = 'purple';
}

function unfocusSort(el, dirSvg, dirSpan) {
    const svg = dirSvg.querySelector('svg')

    dirSpan.removeAttribute('id');
    el.removeAttribute('id');
    svg.removeAttribute('id');
}

    for (let i = 0; i < th.length; i++) {

      if(th[i].textContent.trim() === 'Фамилия Имя Отчество')
        th[i].append(dirSpan);

      th[i].addEventListener("click", ()=>{
        let prop;

        if(dirSvg[i].className.indexOf('hero-table__dirD')  >= 0){
          dir = false;

        }

        if(dirSvg[i].className.indexOf('hero-table__dirU')  >= 0){
          dir = true;
        }

        for (let j = 0; j < th.length; j++){
          dirSvg[j].innerHTML = dirD;

          unfocusSort(titleText[j], dirSvg[j], dirSpan);
          dirSvg[j].classList.remove('hero-table__dirU');
          dirSvg[j].classList.add('hero-table__dirD');
        }

        let flag = false;

        switch(titleText[i].textContent.trim()) {
          case 'ID':
            prop = 'id';
            flag = false;
            break;
          case 'Фамилия Имя Отчество':
            prop = 'surname';
            flag = true;
            break;

          case 'Дата и время создания':
            prop = 'createdAt';
            flag = false;
            break;

          case 'Последние изменения':
            prop = 'updatedAt';
            flag = false;
            break;
        }

        if(prop){

          sortUsers(copyArr, prop, dir);
          if(dir === false) {
            dirSvg[i].classList.remove('hero-table__dirD');
            dirSvg[i].classList.add('hero-table__dirU');
            dirSvg[i].innerHTML = dirU;

            if(flag === true){
              dirSpan.textContent = 'А-Я';
              focuseSort(titleText[i], dirSvg[i], dirSpan);
            }
            else
              focuseSort(titleText[i], dirSvg[i]);
          }
          else {
            dirSvg[i].classList.remove('hero-table__dirU');
            dirSvg[i].classList.add('hero-table__dirD');
            dirSvg[i].innerHTML = dirD;
            if(flag === true){
              dirSpan.textContent = 'Я-А';
              focuseSort(titleText[i], dirSvg[i], dirSpan);
            }
            else
              focuseSort(titleText[i], dirSvg[i]);
          }

          prevEl = th[i];
          renderClients(copyArr);

        }

      });
    }

  })

// Добавление модального окна
  const hero = document.querySelector('.hero');
  const button = document.querySelector('.hero-footer__btn');

  button.addEventListener('click', () => {

    const alaba = createItemForm();



    //высчитывание положение серого фона для контактов

    // let top = alaba.modal.offsetHeight;

    // console.log(top);



  })

})();
