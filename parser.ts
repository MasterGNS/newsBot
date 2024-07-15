import axios from 'axios';
import * as cheerio from 'cheerio';

interface Program{
    time: string;
    title: string;
}

interface Schedule{
    [day: string]: Program[];
}

const days: string[] = [
   'Понедельник',
   'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
]

export async function parseData(){
    try{
        console.log('parsing data...');
        
        const response = await axios.get("https://vesti-omsk.ru/teleprogramma/");
        const data = cheerio.load(response.data);
        
        let schedule:Schedule = {};
        const dayIterator = days[Symbol.iterator]();

        data('table.uk-table.uk-table-divider.uk-table-small tbody').each((index: number, tbody: cheerio.Element) => {
            let dayProgram:Program[] = [];
            data(tbody).find('tr').each((trIndex: number, tr: cheerio.Element) => {
                const columns = data(tr).find('td');
                const time = data(columns[0]).text().trim();
                const title = data(columns[1]).text().trim();    
                dayProgram.push({ time, title });
            });
            const day = dayIterator.next().value;
            schedule[day] = dayProgram;
        });
        СДЕЛАЙ НЕ ТОЛЬКО РАСПИСАНИЕ НО И ПОСЛЕДНИЕ НОВОСТИ

        console.log(schedule);
        console.log('end parsing data...');
    }catch(e){
        console.log(e);
    }
}