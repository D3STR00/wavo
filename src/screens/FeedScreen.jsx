import { IntentCard } from "../components/wavo/intent-card";
import { GoLiveControl as GoLive } from "../components/wavo/go-live";
import { useState } from "react";
import BottomNav from "../components/wavo/bottom-nav";
import Avatar from "../components/Avatar";
import { PRESENCE, INTENT_CONFIG } from "../data/mockUsers";
import { useIntentFeed } from "../hooks/useIntentFeed";
import { sendWaveToUser } from "../hooks/useWaveActions";
import { useWaveRealtime } from "../hooks/useWaveRealtime";
import { WavoAlert } from "../components/wavo/wavo-alert";

const INTENTS = ["☕ Coffee", "🚶 Walk", "💬 Talk", "🏋️ Gym", "+ More"];

export default function FeedScreen({
  userState,
  formatTime,
  goOffline,
  onOpenIntentFlow,
  onGoNearby,
  onGoChat,
  onGoProfile
}) {

  const [activeIntent, setActiveIntent] = useState(0);

  const { intents, loading } = useIntentFeed();

  const { incomingWave, setIncomingWave } = useWaveRealtime();

  const isLive = userState.status === "live";
  const liveConfig = isLive ? INTENT_CONFIG[userState.intent] : null;


  const handleWave = async (card) => {
    await sendWaveToUser(
      card.userId,
      card.intent.toLowerCase()
    );
  };


  return (
    <div style={{
      fontFamily:"'DM Sans',sans-serif",
      background:"#0C0C14",
      color:"#F0EEF8",
      minHeight:"100vh",
      maxWidth:390,
      margin:"0 auto",
      display:"flex",
      flexDirection:"column"
    }}>


      {/* BANNER */}
      <div style={{
        background:"linear-gradient(135deg,#1A0A2E 0%,#0D1A3A 50%,#0A1A1A 100%)",
        padding:"36px 20px 20px",
        position:"relative",
        overflow:"hidden"
      }}>

        <div style={{
          position:"absolute",
          width:180,
          height:180,
          borderRadius:"50%",
          top:-60,
          right:-40,
          background:"radial-gradient(circle,rgba(100,60,220,0.35) 0%,transparent 70%)"
        }}/>


        <div style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          marginBottom:18
        }}>

          <span style={{
            fontFamily:"'Syne',sans-serif",
            fontWeight:800,
            fontSize:26,
            background:"linear-gradient(90deg,#A78BFA,#34D399)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent"
          }}>
            wavo
          </span>


          <span style={{
            background:"rgba(52,211,153,0.15)",
            border:"1px solid rgba(52,211,153,0.4)",
            color:"#34D399",
            fontSize:11,
            padding:"3px 10px",
            borderRadius:20
          }}>
            ● {intents.length} active
          </span>


          <div style={{
            width:36,
            height:36,
            borderRadius:"50%",
            background:"rgba(255,255,255,0.07)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            🔔
          </div>

        </div>


        <div style={{
          fontSize:11,
          color:"rgba(160,160,200,0.7)",
          marginBottom:10
        }}>
          What do you want right now?
        </div>


        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>

          {INTENTS.map((intent,i)=>(

            <div
              key={intent}
              onClick={()=>setActiveIntent(i)}
              style={{
                padding:"8px 16px",
                borderRadius:40,
                fontSize:13,
                cursor:"pointer",
                background:activeIntent===i
                  ?"rgba(167,139,250,0.2)"
                  :"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)"
              }}
            >
              {intent}
            </div>

          ))}

        </div>

      </div>



      {/* LIVE */}

      {isLive && liveConfig && (

        <div style={{
          margin:"8px 16px 0",
          borderRadius:16,
          padding:"11px 14px",
          display:"flex",
          alignItems:"center",
          gap:10,
          background:`linear-gradient(90deg,${liveConfig.activeBg},rgba(52,211,153,0.1))`
        }}>

          <div style={{
            width:8,
            height:8,
            borderRadius:"50%",
            background:liveConfig.color
          }}/>


          <div style={{flex:1,fontSize:12}}>
            {liveConfig.emoji} You're live — {userState.intent} · {formatTime(userState.timeLeft)}
          </div>


          <div onClick={goOffline}>
            End
          </div>

        </div>

      )}



      {/* PRESENCE */}

      <div style={{padding:"16px 20px 8px"}}>

        <div style={{
          fontSize:11,
          color:"rgba(160,160,200,0.5)",
          marginBottom:12
        }}>
          Active now
        </div>


        <div style={{display:"flex"}}>

          {PRESENCE.map((p,i)=>(

            <div key={p.initials} style={{
              marginLeft:i===0?0:-10
            }}>

              <Avatar
                initials={p.initials}
                size={52}
                showDot
                online={p.online}
              />

            </div>

          ))}


          <div style={{
            width:52,
            height:52,
            borderRadius:"50%",
            marginLeft:-10,
            background:"rgba(255,255,255,0.07)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            +18
          </div>

        </div>

      </div>



      {/* FEED */}

      <div style={{
        padding:"14px 16px 16px",
        flex:1,
        overflowY:"auto"
      }}>


        <div style={{
          fontSize:11,
          color:"rgba(160,160,200,0.45)",
          marginBottom:12
        }}>
          Near you
        </div>



        {loading ? (

          <div style={{textAlign:"center"}}>
            Loading intents...
          </div>


        ) : intents.length===0 ? (

          <div style={{textAlign:"center"}}>
            No active intents nearby.
          </div>


        ) : (

          intents.map(card=>(

            <IntentCard
              key={card.id}
              item={{
                userId:card.userId,
                name:card.name,
                intent:card.intent.toLowerCase(),
                message:card.message,
                createdAt:card.created_at,
                expiresAt:card.expires_at,
                state:"normal",
                waveState:"idle"
              }}
              onWave={()=>handleWave(card)}
            />

          ))

        )}

      </div>



      {!isLive && (
        <GoLive onClick={onOpenIntentFlow}/>
      )}



      <WavoAlert
        wave={incomingWave}
        onWaveBack={() => setIncomingWave(null)}
        onPass={() => setIncomingWave(null)}
      />



      <BottomNav
        active="feed"
        onFeed={()=>{}}
        onNearby={onGoNearby}
        onChat={onGoChat}
        onProfile={onGoProfile}
      />


    </div>
  );
}