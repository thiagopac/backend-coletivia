import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

const headers = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
}

export default class TestController {
  public async getTextInChunks({ response }: HttpContextContract) {
    const url = 'https://mocki.io/v1/cdc91ebe-9f06-4bd7-9ca5-3b2ddd09e8e4'
    const { data: json } = await axios.get(url)
    const text = json.text.raw // Access the "raw" property of the "text" object in the JSON
    response.response.writeHead(200, headers)

    const chunkSize = 3 // Each chunk will have 3 letters of the text
    const totalChunks = Math.ceil(text.length / chunkSize)
    let chunksSent = 0

    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize)
      const chunkResponse = `data: ${chunk}\n\n`
      response.response.write(chunkResponse)
      chunksSent++
    }

    if (chunksSent === totalChunks) {
      response.response.write('data: [DONE]')
    }

    response.response.end()
  }
}

/*
JSON used
{
"text": {
"raw": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus orci a blandit pretium. Cras tristique diam at tincidunt interdum. Curabitur dapibus, augue sit amet dignissim eleifend, urna metus sodales lectus, sit amet mollis quam sapien vel quam. Aliquam sed neque vehicula, congue odio sit amet, auctor massa. Pellentesque varius consequat lacus ut vehicula. Donec mollis risus nec tempus tempor. Integer egestas turpis ac turpis venenatis, id fermentum purus ullamcorper. Donec quis facilisis elit, at eleifend orci. Fusce finibus venenatis elementum. Duis libero eros, tempus blandit nisi a, blandit sodales dolor. Duis sed quam molestie, eleifend purus vitae, tempor lectus. Cras molestie commodo nisl at molestie. Ut porttitor, velit et interdum elementum, eros ipsum pretium quam, vel dictum turpis augue eget sem. In et ornare ligula.\n\nSed ultricies massa ut nibh tincidunt, ac tristique ex ullamcorper. Nulla facilisi. Sed ullamcorper lorem vel porttitor commodo. Donec hendrerit a ex at dapibus. Curabitur auctor pharetra gravida. Vestibulum bibendum bibendum sapien, nec finibus felis laoreet quis. Nulla nec erat venenatis, sollicitudin libero vel, vulputate eros. Nullam condimentum turpis ac elit porttitor efficitur. Etiam rutrum nibh turpis. Nullam lacinia urna sit amet nisi ultrices, ut dictum erat auctor. Sed malesuada justo sem, ac mattis ex sagittis sit amet.\n\nCurabitur dignissim sit amet felis nec condimentum. Aliquam vitae leo porta eros venenatis feugiat vitae sit amet dolor. Proin ut mi placerat, rutrum magna sit amet, rutrum erat. In iaculis sodales tortor, vitae interdum nisl. Maecenas enim dolor, tempor eu efficitur nec, pretium eu nunc. Donec vel commodo dui. Maecenas orci magna, aliquam nec placerat quis, rhoncus at ipsum. In a gravida leo, vestibulum ultrices elit. Curabitur elementum tellus nec dapibus efficitur. Maecenas sodales ut dui ac mollis. Donec aliquet quam nec pharetra gravida.\n\nInteger at tortor vitae nulla faucibus pretium non in nisl. Etiam in laoreet dui, a euismod eros. Nulla bibendum nec orci sed vestibulum. Proin vehicula lectus in sem aliquam tristique. Vivamus ac dignissim felis. Suspendisse potenti. Curabitur rhoncus ut lacus id mattis. Proin pellentesque felis sit amet lobortis aliquet. In porta, est sed molestie maximus, purus justo commodo velit, eu dignissim libero eros nec neque. Mauris auctor pellentesque vulputate. Sed porta diam a ipsum blandit fringilla. Quisque vitae gravida nulla. Proin nec sem mi. Nullam vitae arcu volutpat sapien posuere dignissim.\n\nNullam leo mauris, rutrum id magna id, finibus euismod purus. Sed nec sollicitudin magna. Cras nec sollicitudin lectus, at tempor felis. Sed dignissim sodales consectetur. Pellentesque faucibus a arcu id mollis. Nunc feugiat enim et sem mattis tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a lobortis nulla. In venenatis congue lectus, ac laoreet eros tincidunt eget. Mauris eget risus id velit dignissim ultrices id eget lorem. Proin blandit, ex ut hendrerit pretium, quam dolor venenatis lorem, non ultrices quam leo non nunc. Sed lobortis congue venenatis. Duis dictum ante a orci lobortis, at elementum nunc tempus. Aenean mattis scelerisque eros, quis commodo nibh rutrum nec."
}
}
*/
