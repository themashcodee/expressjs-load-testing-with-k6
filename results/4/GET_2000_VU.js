import http from "k6/http"
import { check, group } from "k6"

export let options = {
	stages: [
		{ duration: "0.1m", target: 10 },
		{ duration: "1m", target: 2000 },
		{ duration: "0.1m", target: 10 },
	],
}

const ids = [
	"6445fc15-2a37-4350-9a0d-39e14d287ef7",
	"954b732e-4134-4576-9615-34b20304d07a",
	"48ea1673-a2c9-40bf-ac8f-c77a331e1041",
	"d4528a1f-cbb3-4ba5-853f-14ba1f625a15",
	"698e2a3f-1127-448f-a3b0-1750a97af38e",
	"e63d57b2-f977-4c2c-9a89-e1bd39941ace",
	"b66710b2-ea76-4a1a-af65-d6749f3ad4b3",
	"90b2cf2d-bfa7-4a37-bdaa-c38079a22b35",
	"d3f1a3e7-d877-4da5-9714-663955d54372",
	"a44138dc-d7d9-48d5-a24f-8d6414aa568f",
	"d05ad81b-1b82-4b6e-a2d0-1c7852c90a26",
	"449f0160-b469-4707-aee5-bb1a2d42491d",
	"14b067af-41c5-44a9-8c7e-938bd96f0696",
	"9282324f-2526-48b5-9450-3e196cd3fe49",
	"ffb9527c-67f4-469f-a1c3-613ae9542a0e",
	"9d08eb9f-40cb-48bb-843e-6e78ec167172",
	"d87762db-efae-4971-8a67-b9ff422f31d2",
	"e346a999-53fa-4057-a477-0ee3eb01913a",
	"fcaab200-827e-41a3-bce0-136a32a1d23f",
	"09973c92-8887-4182-b2b4-e116f49eb05e",
	"ee93acc2-d4b2-471a-a854-c17d3af5b6c6",
	"06138fb6-d56e-4a87-976a-e3dab83cc9c9",
	"4e892e02-9b92-4734-bdd0-5d140bc6cf52",
	"cd472214-d6db-43f7-964d-dbfe0d614b27",
	"87041c7b-6c2a-4648-8273-2efc7276dfa2",
	"78926fd0-8fbf-472d-9476-f81261914b89",
	"b56ae08c-bd16-4ec3-a0e1-d4a4a655c470",
	"b88df77e-52fc-4a90-a50b-3be17df9c385",
	"dedb5a58-c45e-4bb1-ac13-45d85e8ab806",
	"7e238066-7950-4324-96fb-e6b5199961b7",
	"1676bb7c-72ab-401e-a829-6aa819df01f3",
	"5d165b53-fa14-418e-8081-f56ef32d35ee",
	"10352763-6878-456d-a0c3-eb7f665ebe13",
	"2b65e85b-9360-4cb2-82bd-9b572780a00b",
	"4e1cb764-db9b-46f9-a90a-0b2788763a1d",
	"ee90c16b-fe0e-4afa-8545-899fab0100bf",
	"35261b24-15f2-4a95-b609-ac841bcd1424",
	"0bcbfbf4-ec1b-4c55-9e74-38b78b8247bd",
	"f92ab81f-3efe-4df9-a1d3-11a6adbec8e0",
	"e395bc0e-0372-4374-930f-233aca0efaaa",
	"e309f801-e119-4724-832b-0dcba7a84389",
	"26c0c544-7bf0-4a7e-8df7-986b10c0d8cd",
	"3e352967-972c-4776-9076-9451551c7909",
	"3caaad90-84b0-4b10-a9ca-9ace58e9311e",
	"40b29999-00d0-4a45-bab7-ff9af7a46082",
	"ae1febfe-b79b-4f66-a689-f63e8065a959",
	"0265cb47-0fdb-444a-ba56-fc8ed96a4342",
	"fa34c639-7a68-4d70-9846-f54e04532246",
	"797fd783-d0bb-4c3b-af40-ef33d245b4a0",
	"64060899-0459-4a4a-8787-fa35d153cc67",
	"4b44cd97-600a-4c15-8b51-fa59c4fad184",
	"3a17e3d7-7a3a-4e3e-8526-e6aea1e1d464",
	"c676921b-7670-43d7-81f7-78be57a9e116",
	"f8aef731-c1fe-42fd-a0ce-82762f3134ff",
	"0c0f4a7c-dee2-44a2-9c29-389c873242aa",
	"7d763486-7816-4984-be14-8e8e5068eec4",
	"c1af9942-1156-4dd3-97fc-0800027174e6",
	"42999f5e-7aeb-426f-9051-975caeddda86",
	"661f60cf-2c42-4733-ac2b-9415b9177dd9",
	"a9f31561-6095-4459-8ca7-7bfa328b1115",
	"522fd748-cbb5-467d-a7b6-8d0711f72d72",
	"ad58d996-2100-4d96-a0e8-9bef243fa43b",
	"27904012-79c7-43de-8357-387da518361b",
	"6abd8130-2598-404e-8937-65769c669168",
	"91b1defb-0dbd-49ab-9089-b778af9d8dbd",
	"aba63f9e-40f5-4e30-8179-c01b630e3a62",
	"4bf58918-c33a-4a37-a475-e6a3729da492",
	"869ed104-18bd-4f8f-bdd9-c481249638f9",
	"4052bb1f-9838-4775-b54c-5f52cfbb1a0a",
	"db2d5611-f518-4283-806e-c279391c3ae9",
	"f70ba258-dbe1-4603-976f-2470f3b5940a",
	"f544fb2f-c89d-48f9-9a2b-56d06a9ab05a",
	"1d2698ec-57fc-4fc1-bdc0-d906ea022fc2",
	"1f2d5dad-6d6d-4dcb-b374-ec2edf078614",
	"60d3c67e-2e2f-46c5-a8e6-35d55b1bce13",
	"977c0add-583b-4b03-8382-cd1be3954a73",
	"50a6b0d1-56ba-4a66-90c5-909ef83fe97c",
	"4649d585-1955-46bd-95bb-3dcb9dc3cc6d",
	"fd628202-e880-4bca-92d7-b51a7d2dbac2",
	"176079dd-1fb0-49e1-b0eb-b024fe7e0fa6",
	"539a4b35-20e6-413f-980d-7194274e9b57",
	"57ad607c-561f-4a5c-bb5b-31235c5f2c9a",
	"820195a4-c89b-444d-981f-0e0cf68404df",
	"d431a2c9-301f-4b88-b52a-e5847d569c1b",
	"1de7fb89-c6f9-4dfc-89c9-cb24d761c429",
	"709e7cc7-33de-47a2-aed4-e529cc6d5901",
	"ee3435b6-0578-4b92-9e29-edb2c80913fb",
	"79e5e0ae-2d4f-4a63-8b1c-e4bd93a47b5a",
	"f4b96fd3-1d8a-4dc1-bf1a-af5c27dab0d5",
	"d6fc7a10-f026-46a4-863c-ab2232a8c913",
	"da45cf28-2f13-412b-b4fc-f56607cc0889",
	"37d65220-a4bb-4d1d-8b01-dd8ee04d2178",
	"a85a5721-5425-4aba-af9d-b1f4a98a4d32",
	"392a0e4d-38c7-4c5b-bdad-9172006ccf6a",
	"a470d45f-d28b-42ec-ae8e-d6c52d7010cf",
	"59a60824-da01-4de7-8091-18cc0389ea60",
	"1f5dd496-389c-4a89-9a3c-059b8c0bba43",
	"4090051f-a8ce-4d8f-8596-c3bb4c26810d",
	"69dd3021-677c-49d3-b0ea-b168c4330291",
	"fab6a9dc-383a-468b-94ac-fbf486310bdf",
]

export default function () {
	group("USER", () => {
		const randomId = ids[Math.floor(Math.random() * ids.length)]
		const response = http.get(`SERVER_URL/api/v1/users/${randomId}`)

		check(response, {
			"status code should be 200": (res) => res.status === 200,
		})
	})
}
