"use client";
import { Box, Button, Chip, Typography, AspectRatio, Avatar } from "@mui/joy";
import { Share, ShowChart, MoreVert, LocalActivity } from "@mui/icons-material";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useChainId,
  useAccount,
} from "wagmi";
import { baseSepolia } from "viem/chains";
import BuilderCardABI from "@/lib/abi/BuilderCard.json";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BUILDER_CARD_CONTRACT, BLOCKSCOUT_URL } from "@/constants";
import { parseEther } from "viem";
import { Collectors } from "@/functions/top-collectors";

export const BuilderDetails = ({
  displayName,
  image,
  totalSupply,
  wallet,
  collectors,
}: {
  displayName: string;
  image: string;
  tokenId: number;
  totalSupply: number | undefined;
  wallet: `0x${string}`;
  collectors: Collectors[];
}) => {
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });
  const [isCollecting, setIsCollecting] = useState(false);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address } = useAccount();

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        toast.success(`Transaction successful: ${hash}`, {
          action: {
            label: "View",
            onClick: () => window.open(`${BLOCKSCOUT_URL}tx/${hash}`),
          },
        });
        fetch(`/api/collect`, {
          method: "POST",
          body: JSON.stringify({ hash, wallet }),
        });
      } else {
        toast.error("Transaction failed");
      }
      setIsCollecting(false);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (hash) {
      toast.info("Transaction submitted, please wait..");
    }
  }, [hash]);

  const handleCollect = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (chainId !== baseSepolia.id) {
      await switchChain({ chainId: baseSepolia.id });
    }
    setIsCollecting(true);

    writeContract({
      address: BUILDER_CARD_CONTRACT,
      abi: BuilderCardABI,
      functionName: "collect",
      chain: baseSepolia,
      args: [wallet],
      value: parseEther("0.001"),
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", lg: "300px" },
        display: "flex",
        flexDirection: "column",
        gap: 1,
        position: "relative",
      }}
    >
      {collectors.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", border: "0px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              paddingY: "12px",
              paddingX: "16px",
              backgroundColor: "black",
              borderTopRightRadius: "16px",
              borderTopLeftRadius: "16px",
              background: "black",
            }}
          >
            <Typography level="body-md" textColor="common.white">
              Top Collectors
            </Typography>
          </Box>
          {collectors.map((collector, index) => (
            <Box
              key={`${collector.id}-collector`}
              sx={{
                display: "flex",
                flexDirection: "row",
                paddingY: "12px",
                paddingX: "16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.19)",
                alignItems: "center",
                background: "white",
                borderBottomLeftRadius:
                  index === collectors.length - 1 ? "16px" : "0px",
                borderBottomRightRadius:
                  index === collectors.length - 1 ? "16px" : "0px",
              }}
            >
              <Avatar src={image} sx={{ width: "38", height: "38" }} />
              <Typography level="body-md" sx={{ marginLeft: 2 }}>
                {shortenAddress(collector.collector)}
              </Typography>
              <Chip
                variant="solid"
                color="neutral"
                size="sm"
                sx={{ marginLeft: "auto", paddingY: "4px" }}
              >
                x{collector.balance}
              </Chip>
            </Box>
          ))}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "calc(100% - 48px)",
          backgroundColor: "#F0EFF7",
          padding: "16px",
          zIndex: 10,
        }}
      >
        <Button
          size="lg"
          sx={{ width: "100%", backgroundColor: "black" }}
          startDecorator={<LocalActivity />}
          onClick={() => handleCollect()}
          loading={isCollecting}
        >
          {isCollecting ? "" : "Collect"}
        </Button>
        <Typography
          level="body-sm"
          textColor="common.black"
          textAlign={"center"}
        >
          {(totalSupply ?? 0) > 0
            ? `x${totalSupply} collected`
            : "Be the first to collect!"}
        </Typography>
      </Box>
    </Box>
  );
};
