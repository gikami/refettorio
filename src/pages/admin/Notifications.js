import React, { useState } from 'react'
// import { useParams } from "react-router-dom"
import { NotificationManager } from "react-notifications"
import { sendPush } from "../../http/adminAPI"
import InputMask from 'react-input-mask'

const Notifications = () => {
    // const { action, page } = useParams()
    const objectData = {
        title: '',
        text: '',
        id: '',
        token: '',
        email: '',
        phone: '',
        params: false,
        all: false
    }
    const [data, setData] = useState(objectData)

    const change = (e) => {
        setData({ ...data, [e.target.name]: e.target.name == 'all' ? e.target.checked : e.target.value })
    }
    const submit = async (e) => {
        try {
            e.preventDefault()

            let send = await sendPush(data)
            if (send) {
                NotificationManager.success('Push уведомление отправлено')
                setData(objectData);
            } else {
                NotificationManager.error('Произошла неизвестная ошибка')
            }
        } catch (e) {
            if (e.response && e.response.data) {
                NotificationManager.error(e.response.data.message)
            } else {
                NotificationManager.error(e)
            }
        }
    }

    return <div>
        <div className="d-flex justify-content-between">
            <h5>Создать push уведомление</h5>
        </div>
        <form onSubmit={submit} onChange={change} >
            <fieldset className="mb-3">
                <div className="sec-font mb-2">Email или номер телефона</div>
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" placeholder="Введите email" name="email" value={data.email} className="mb-3" />
                    </div>
                    <div class="col-md-6">
                        <InputMask mask="+7 999 999 99 99" placeholder="+7 000 000 00 00" name="phone" maskChar="" value={data.phone} onChange={change} className="mb-3" />
                    </div>
                </div>
                <small>Заполните только одно поле</small>
            </fieldset>
            <hr />
            <fieldset className="mb-3">
                <div className="sec-font mb-2">Заголовок</div>
                <input type="text" placeholder="Введите заголовок" name="title" value={data.title} className="mb-3" required />
            </fieldset>
            <fieldset className="mb-3">
                <div className="sec-font mb-2">Тест уведомления</div>
                <textarea placeholder="Введите текст" name="text" className="mb-3" value={data.text} required />
            </fieldset>
            <fieldset className="mb-3">
                <div class="d-flex align-items-center mb-2">
                    <input type="checkbox" name="all" id="all" />
                    <label for="all" class="flex-1 ms-2">отправить всем</label>
                </div>
            </fieldset>
            <div className="d-flex">
                <button type="submit" className="btn btn-1">Отправить</button>
            </div>
        </form>
    </div>

}

export default Notifications