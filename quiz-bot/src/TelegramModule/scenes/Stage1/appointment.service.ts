/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { Markup } from 'telegraf';
import telegramCalendar from 'telegram-bot-calendar-lite';
import * as calendarModule from 'telegram-bot-time-calendar-lite';
import moment, { Moment } from 'moment';
import { CallbackEnum } from './callback.enum';

const TimeCalendar = calendarModule.modules as typeof TimeCalendar;

@Injectable()
export class AppointmentService {
    private _calendar = new telegramCalendar();
    private _calendarMessageId: number | undefined = undefined;
    private _timeMessageId: number | undefined = undefined;
    private _calendarAcceptMessageId: number | undefined = undefined;
    private _timeAcceptMessageId: number | undefined = undefined;


    private _selectedDate: Moment | undefined = undefined;

    async showCalendar(ctx: TelegrafContext) {
        const buttons = this._calendar.generateCalendar();
        this._calendarMessageId = (await ctx.reply('Выберите дату', { reply_markup: buttons })).message_id;
    }

    async showTime(ctx: TelegrafContext) {
        const calendar = new TimeCalendar(10, 0, 18, 0, 15); //Начало в 10:00, конец в 18:00, интервал 15 минут
        const timeSlots = calendar.createTimeSlots();
        this._timeMessageId = (await ctx.reply('Выберите время', { reply_markup: { inline_keyboard: timeSlots } })).message_id;
    }

    onCallback(ctx: TelegrafContext) {
        switch (this.parseCallback(ctx)) {
            case CallbackEnum.DATE:
                return this.onDate(ctx);
            case CallbackEnum.TIME:
                return this.onTime(ctx);
            case CallbackEnum.YES_DATE:
                return this.onDateAccept(ctx);
            case CallbackEnum.NO_DATE:
                return this.onDateReject(ctx);
            case CallbackEnum.YES_TIME:
                return this.onTimeAccept(ctx);
            case CallbackEnum.NO_TIME:
                return this.onTimeReject(ctx);

            default:
                throw new Error('Ошибка: неизвестный ответ от пользователя');;
        }
    }

    async onTime(ctx: TelegrafContext) {
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
            return ctx.answerCbQuery('Ошибка: не удалось распознать время');
        }

        try {
            const data = ctx.callbackQuery?.data;
            if (data.includes(CallbackEnum.TIME)) {
                const parsedTime = data.replace(/\..*$/, "").split(':')
                this._selectedDate = this._selectedDate?.hours(Number(parsedTime[0])).minutes(Number(parsedTime[1]));
                await ctx.answerCbQuery();
                await ctx.deleteMessage(this._timeMessageId);
                this._timeAcceptMessageId = (await ctx.reply(`Время корректное ${this._selectedDate?.format('HH:mm')}?`, Markup.inlineKeyboard([
                    Markup.button.callback('Да', CallbackEnum.YES_TIME),
                    Markup.button.callback('Нет', CallbackEnum.NO_TIME),
                ]))).message_id;
            }
        } catch (error) {
            console.error('onDate', error)
            return ctx.answerCbQuery('Ошибка: не удалось распознать время')
        }
    }

    async onDate(ctx: TelegrafContext) {
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
            return ctx.answerCbQuery('Ошибка: не удалось распознать дату');
        }

        try {
            const data = ctx.callbackQuery?.data;
            if (data.includes(CallbackEnum.DATE)) {
                this._selectedDate = moment(data.replace(/\..*$/, ""), 'YYYY-MM-DD');
                await ctx.answerCbQuery();
                await ctx.deleteMessage(this._calendarMessageId);
                this._calendarAcceptMessageId = (await ctx.reply(`Дата корректная ${this._selectedDate.format('DD MMMM YYYY')}?`, Markup.inlineKeyboard([
                    Markup.button.callback('Да', CallbackEnum.YES_DATE),
                    Markup.button.callback('Нет', CallbackEnum.NO_DATE),
                ]))).message_id;
            }
        } catch (error) {
            console.error('onDate', error)
            return ctx.answerCbQuery('Ошибка: не удалось распознать дату')
        }
    }

    onDateAccept(ctx: TelegrafContext) {
        ctx.deleteMessage(this._calendarAcceptMessageId);
        this.showTime(ctx)
    }

    onDateReject(ctx: TelegrafContext) {
        this.showCalendar(ctx)
    }

    onTimeAccept(ctx: TelegrafContext) {
        ctx.deleteMessage(this._timeAcceptMessageId);
        ctx.reply(`Спасибо! Ваше время ${this._selectedDate?.format('YYYY-MM-DD HH:mm')}. Скоро я с вами свяжусь для подтверждения`)
    }

    onTimeReject(ctx: TelegrafContext) {
        this.showTime(ctx)
    }

    parseCallback(ctx: TelegrafContext): CallbackEnum {
        if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
            ctx.answerCbQuery('Ошибка: ответ не распознан');
            throw new Error('Ошибка: ответ не распознан')
        }

        const data = ctx.callbackQuery.data;
        switch (true) {
            case data.includes(CallbackEnum.DATE):
                return CallbackEnum.DATE;
            case data.includes(CallbackEnum.TIME):
                return CallbackEnum.TIME;
            case data.includes(CallbackEnum.YES_DATE):
                return CallbackEnum.YES_DATE;
            case data.includes(CallbackEnum.NO_DATE):
                return CallbackEnum.NO_DATE;
            case data.includes(CallbackEnum.YES_TIME):
                return CallbackEnum.YES_TIME;
            case data.includes(CallbackEnum.NO_TIME):
                return CallbackEnum.NO_TIME;

            default:
                throw new Error('Ошибка: неизвестная команда');
        }
    }


}
