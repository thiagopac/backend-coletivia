import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MidjourneyImageGeneration from 'App/Models/MidjourneyImageGeneration'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await MidjourneyImageGeneration.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        featureId: 5,
        userId: 1,
        prompt:
          'Um animal felino de uma espécie desconhecida, encontrado em um planeta recém descoberto, na galáxia de Andrômeda. Imagem hiperrealista.',
        behavior: JSON.parse('{}'),
        images: JSON.parse(
          '{ "images": [ { "id": "1120786225574465546", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120786224743972934/Coletivia_A_feline_animal_of_an_unknown_species_found_on_a_newl_a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8.png", "hash": "a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8", "flags": 0, "content": "**A feline animal of an unknown species found on a newly discovered planet in the Andromeda galaxy. Hyperrealist image.** - <@1117918982142447687> (fast)", "options": [ { "type": 2, "label": "U1", "style": 2, "custom": "MJ::JOB::upsample::1::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "U2", "style": 2, "custom": "MJ::JOB::upsample::2::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "U3", "style": 2, "custom": "MJ::JOB::upsample::3::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "U4", "style": 2, "custom": "MJ::JOB::upsample::4::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "🔄", "style": 2, "custom": "MJ::JOB::reroll::0::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8::SOLO" }, { "type": 2, "label": "V1", "style": 2, "custom": "MJ::JOB::variation::1::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "V2", "style": 2, "custom": "MJ::JOB::variation::2::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "V3", "style": 2, "custom": "MJ::JOB::variation::3::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" }, { "type": 2, "label": "V4", "style": 2, "custom": "MJ::JOB::variation::4::a01fe04a-0f34-4e0f-9b86-2ed6a45d14d8" } ], "progress": "done" } ] }'
        ),
        variations: JSON.parse('{ "variations": [] }'),
        upscales: JSON.parse('{ "upscales": [] }'),
      },
      {
        id: 2,
        featureId: 5,
        userId: 1,
        prompt:
          'Um animal felino de uma espécie desconhecida, com vários traços extraterrestres, encontrado em um planeta recém descoberto. O animal é um híbrido de felino com réptil e tem feições que não permitem saber se ele é amigável ou violento. Imagem hiperrealista.',
        behavior: JSON.parse('{}'),
        images: JSON.parse(
          '{ "images": [ { "id": "1120789229480456302", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120789229002297364/Coletivia_A_feline_animal_of_an_unknown_species_with_several_ex_e1efc63a-4991-4385-82c8-cc4e11554aa7.png", "hash": "e1efc63a-4991-4385-82c8-cc4e11554aa7", "flags": 0, "content": "**A feline animal of an unknown species with several extraterrestrial features found on a newly discovered planet. The animal is a reptile feline hybrode and has features that do not allow you to know if it is friendly or violent. Hyperrealist image.** - <@1117918982142447687> (fast)", "options": [ { "type": 2, "label": "U1", "style": 2, "custom": "MJ::JOB::upsample::1::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "U2", "style": 2, "custom": "MJ::JOB::upsample::2::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "U3", "style": 2, "custom": "MJ::JOB::upsample::3::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "U4", "style": 2, "custom": "MJ::JOB::upsample::4::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "🔄", "style": 2, "custom": "MJ::JOB::reroll::0::e1efc63a-4991-4385-82c8-cc4e11554aa7::SOLO" }, { "type": 2, "label": "V1", "style": 2, "custom": "MJ::JOB::variation::1::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "V2", "style": 2, "custom": "MJ::JOB::variation::2::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "V3", "style": 2, "custom": "MJ::JOB::variation::3::e1efc63a-4991-4385-82c8-cc4e11554aa7" }, { "type": 2, "label": "V4", "style": 2, "custom": "MJ::JOB::variation::4::e1efc63a-4991-4385-82c8-cc4e11554aa7" } ], "progress": "done" } ] }'
        ),
        variations: JSON.parse(
          '{ "variations": [ { "id": "1120791320240345178", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120791319728619530/Coletivia_A_feline_animal_of_an_unknown_species_with_several_ex_48c81dfc-249b-4c2f-85ce-93540f594500.png", "hash": "48c81dfc-249b-4c2f-85ce-93540f594500", "flags": 0, "content": "**A feline animal of an unknown species with several extraterrestrial features found on a newly discovered planet. The animal is a reptile feline hybrode and has features that do not allow you to know if it is friendly or violent. Hyperrealist image.** - Variations by <@1117918982142447687> (fast)", "options": [ { "type": 2, "label": "U1", "style": 2, "custom": "MJ::JOB::upsample::1::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "U2", "style": 2, "custom": "MJ::JOB::upsample::2::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "U3", "style": 2, "custom": "MJ::JOB::upsample::3::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "U4", "style": 2, "custom": "MJ::JOB::upsample::4::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "🔄", "style": 2, "custom": "MJ::JOB::reroll::0::48c81dfc-249b-4c2f-85ce-93540f594500::SOLO" }, { "type": 2, "label": "V1", "style": 2, "custom": "MJ::JOB::variation::1::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "V2", "style": 2, "custom": "MJ::JOB::variation::2::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "V3", "style": 2, "custom": "MJ::JOB::variation::3::48c81dfc-249b-4c2f-85ce-93540f594500" }, { "type": 2, "label": "V4", "style": 2, "custom": "MJ::JOB::variation::4::48c81dfc-249b-4c2f-85ce-93540f594500" } ], "progress": "done" } ] }'
        ),
        upscales: JSON.parse(
          '{ "upscales": [ { "id": "1120794764334346249", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120794763973640342/Coletivia_A_feline_animal_of_an_unknown_species_with_several_ex_52f87973-93c7-4392-b300-30d0a86eee0f.png", "hash": "52f87973-93c7-4392-b300-30d0a86eee0f", "flags": 0, "content": "**A feline animal of an unknown species with several extraterrestrial features found on a newly discovered planet. The animal is a reptile feline hybrode and has features that do not allow you to know if it is friendly or violent. Hyperrealist image.** - Image #1 <@1117918982142447687>", "options": [ { "type": 2, "label": "Make Variations", "style": 2, "custom": "MJ::JOB::variation::1::52f87973-93c7-4392-b300-30d0a86eee0f::SOLO" }, { "type": 2, "label": "Favorite", "style": 2, "custom": "MJ::BOOKMARK::52f87973-93c7-4392-b300-30d0a86eee0f" } ], "progress": "done" }, { "id": "1120798233795498205", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120798233468350605/Coletivia_A_feline_animal_of_an_unknown_species_with_several_ex_437ea0e2-498b-4cce-8df9-2043899baf4a.png", "hash": "437ea0e2-498b-4cce-8df9-2043899baf4a", "flags": 0, "content": "**A feline animal of an unknown species with several extraterrestrial features found on a newly discovered planet. The animal is a reptile feline hybrode and has features that do not allow you to know if it is friendly or violent. Hyperrealist image.** - Image #2 <@1117918982142447687>", "options": [ { "type": 2, "label": "Make Variations", "style": 2, "custom": "MJ::JOB::variation::1::437ea0e2-498b-4cce-8df9-2043899baf4a::SOLO" }, { "type": 2, "label": "Favorite", "style": 2, "custom": "MJ::BOOKMARK::437ea0e2-498b-4cce-8df9-2043899baf4a" } ], "progress": "done" } ] }'
        ),
      },
      {
        id: 3,
        featureId: 5,
        userId: 1,
        prompt:
          'Uma raposa com pêlos azuis e feição de animal violento em um horizonte com céu estrelado com aurora boreal na cor azul.',
        behavior: JSON.parse('{}'),
        images: JSON.parse(
          '{ "images": [ { "id": "1120886421130059888", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120886420291207269/Coletivia_A_fox_with_blue_hair_and_violent_animal_features_in_a_7c199834-518b-4fd1-bd1d-b0576122aeca.png", "hash": "7c199834-518b-4fd1-bd1d-b0576122aeca", "flags": 0, "content": "**A fox with blue hair and violent animal features in a horizon with starry sky with blue aurora in blue** - <@1117918982142447687> (fast)", "progress": "done" } ] }'
        ),
        variations: JSON.parse('{ "variations": [] }'),
        upscales: JSON.parse(
          '{ "upscales": [ { "id": "1120886655436456006", "uri": "https://cdn.discordapp.com/attachments/1120713404731101245/1120886654752796773/Coletivia_A_fox_with_blue_hair_and_violent_animal_features_in_a_fb5bc8ee-ffb3-40ef-99f7-270b678b0f4b.png", "hash": "fb5bc8ee-ffb3-40ef-99f7-270b678b0f4b", "flags": 0, "content": "**A fox with blue hair and violent animal features in a horizon with starry sky with blue aurora in blue** - Image #4 <@1117918982142447687>", "progress": "done" } ] }'
        ),
      },
    ])
  }
}
