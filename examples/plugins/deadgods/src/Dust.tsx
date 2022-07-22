import {
  usePublicKey,
  View,
  Text,
  Button,
  NavStack,
  NavScreen,
} from "react-xnft";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { useEstimatedRewards, gemFarmClient, DEAD_FARM } from "./utils";

export function Dust() {
  return (
    <View
      style={{
        backgroundImage:
          "url(https://user-images.githubusercontent.com/6990215/180327248-61e7675e-490b-4bdf-8588-370aa008302a.png)",
        backgroundRepeat: "no-repeat",
        height: "100%",
        backgroundColor: "#111827",
      }}
    >
      <View
        style={{
          background:
            "linear-gradient(180deg, rgba(17, 24, 39, 0) 0%, rgba(17, 24, 39, 0.102162) 38.3%, #111827 81.65%)",
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          height: "460px",
        }}
      ></View>
      <View style={{ height: "100%" }}>
        <NavStack
          initialRoute={{ name: "dust" }}
          options={({ route }) => {
            switch (route.name) {
              case "dust":
                return {
                  title: "",
                };
              case "deadgods":
                return { title: "Stake Deadgods" };
              case "degods":
                return { title: "Stake DeadGods" };
              default:
                throw new Error("unknown route");
            }
          }}
          style={{}}
        >
          <NavScreen
            name={"dust"}
            component={(props: any) => <ClaimDust {...props} />}
          />
        </NavStack>
      </View>
    </View>
  );
}

function ClaimDust() {
  const estimatedRewards = useEstimatedRewards();
  return (
    <View>
      <View>
        <Header isDead={true} estimatedRewards={estimatedRewards} />
      </View>
    </View>
  );
}

function Header({ isDead, estimatedRewards }: any) {
  const publicKey = usePublicKey();

  const claimDust = () => {
    (async () => {
      const farmClient = gemFarmClient();
      const rewardAMint = new PublicKey(
        "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ"
      );
      const rewardBMint = new PublicKey(
        "So11111111111111111111111111111111111111112"
      );
      const [farmer, bumpFarmer] = await PublicKey.findProgramAddress(
        [Buffer.from("farmer"), DEAD_FARM.toBuffer(), publicKey.toBuffer()],
        farmClient.programId
      );
      const [farmAuthority, bumpAuth] = await PublicKey.findProgramAddress(
        [DEAD_FARM.toBuffer()],
        farmClient.programId
      );
      const [rewardAPot, bumpPotA] = await PublicKey.findProgramAddress(
        [
          Buffer.from("reward_pot"),
          DEAD_FARM.toBuffer(),
          rewardAMint.toBuffer(),
        ],
        farmClient.programId
      );
      const [rewardBPot, bumpPotB] = await PublicKey.findProgramAddress(
        [
          Buffer.from("reward_pot"),
          DEAD_FARM.toBuffer(),
          rewardBMint.toBuffer(),
        ],
        farmClient.programId
      );

      try {
        const tx = await farmClient.methods
          .claim(bumpAuth, bumpFarmer, bumpPotA, bumpPotB)
          .accounts({
            farm: DEAD_FARM,
            farmAuthority,
            farmer,
            identity: publicKey,
            rewardAPot,
            rewardAMint,
            rewardADestination: await anchor.utils.token.associatedAddress({
              mint: rewardAMint,
              owner: publicKey,
            }),
            rewardBPot,
            rewardBMint,
            rewardBDestination: await anchor.utils.token.associatedAddress({
              mint: rewardBMint,
              owner: publicKey,
            }),
          })
          .transaction();
        const signature = await window.anchorUi.send(tx);
        console.log("tx signature", signature);
      } catch (err) {
        console.log("err here", err);
      }
    })();
  };
  return (
    <View
      style={{
        marginTop: "255px",
      }}
    >
      <View>
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: "150%",
          }}
        >
          Estimated Rewards
        </Text>
        <Text
          style={{
            fontSize: "40px",
            marginTop: "12px",
            textAlign: "center",
            fontWeight: 500,
            lineHeight: "24px",
            color: "#fff",
          }}
        >
          {estimatedRewards} DUST
        </Text>
        <Text
          style={{
            marginTop: "12px",
            color: "rgba(255, 255, 255, 0.8)",
            textAlign: "center",
          }}
        >
          {isDead ? 15 : 5} $DUST/day
        </Text>
      </View>
      <View
        style={{
          marginTop: "20px",
          width: "268px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Button
          onClick={claimDust}
          style={{
            flex: 1,
            background: "#FFEFEB",
            border: "1px solid #000000",
            boxShadow: "4px 3px 0px #6100FF",
            borderRadius: "8px",
            width: "192px",
            height: "40px",
            color: "#6100FF",
            fontWeight: 500,
          }}
        >
          Claim $DUST
        </Button>
      </View>
    </View>
  );
}
