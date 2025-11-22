'use client'

import { useState } from 'react'

export default function Home() {
  const [blueprintClass, setBlueprintClass] = useState('')
  const [blueprintOutput, setBlueprintOutput] = useState('')

  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: '',
    drawCalls: '',
    triangles: '',
  })
  const [performanceOutput, setPerformanceOutput] = useState('')

  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState('Blueprint')
  const [namingOutput, setNamingOutput] = useState('')

  const [materialParams, setMaterialParams] = useState({
    baseColor: '#808080',
    metallic: '0.0',
    roughness: '0.5',
  })
  const [materialOutput, setMaterialOutput] = useState('')

  const generateBlueprint = () => {
    if (!blueprintClass) {
      setBlueprintOutput('Please enter a class name')
      return
    }

    const code = `// ${blueprintClass}.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "${blueprintClass}.generated.h"

UCLASS()
class A${blueprintClass} : public AActor
{
    GENERATED_BODY()

public:
    A${blueprintClass}();

protected:
    virtual void BeginPlay() override;

public:
    virtual void Tick(float DeltaTime) override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
    float Speed;

    UFUNCTION(BlueprintCallable, Category = "Actions")
    void DoAction();
};

// ${blueprintClass}.cpp
#include "${blueprintClass}.h"

A${blueprintClass}::A${blueprintClass}()
{
    PrimaryActorTick.bCanEverTick = true;
    Speed = 100.0f;
}

void A${blueprintClass}::BeginPlay()
{
    Super::BeginPlay();
    UE_LOG(LogTemp, Warning, TEXT("${blueprintClass} initialized"));
}

void A${blueprintClass}::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}

void A${blueprintClass}::DoAction()
{
    UE_LOG(LogTemp, Log, TEXT("Action executed"));
}`

    setBlueprintOutput(code)
  }

  const analyzePerformance = () => {
    const fps = parseFloat(performanceMetrics.fps) || 0
    const draws = parseInt(performanceMetrics.drawCalls) || 0
    const tris = parseInt(performanceMetrics.triangles) || 0

    let analysis = '=== Performance Analysis ===\n\n'

    // FPS Analysis
    if (fps >= 60) {
      analysis += '✓ FPS: Excellent (60+)\n'
    } else if (fps >= 30) {
      analysis += '⚠ FPS: Acceptable (30-60)\n'
    } else {
      analysis += '✗ FPS: Poor (<30) - Optimization needed\n'
    }

    // Draw Calls
    if (draws <= 1000) {
      analysis += '✓ Draw Calls: Good (≤1000)\n'
    } else if (draws <= 2000) {
      analysis += '⚠ Draw Calls: Moderate (1000-2000)\n'
    } else {
      analysis += '✗ Draw Calls: High (>2000) - Consider batching\n'
    }

    // Triangle Count
    const triInMillions = (tris / 1000000).toFixed(2)
    if (tris <= 1000000) {
      analysis += `✓ Triangles: Good (${triInMillions}M)\n`
    } else if (tris <= 3000000) {
      analysis += `⚠ Triangles: Moderate (${triInMillions}M)\n`
    } else {
      analysis += `✗ Triangles: High (${triInMillions}M) - Consider LODs\n`
    }

    analysis += '\n=== Recommendations ===\n'
    if (fps < 60) {
      analysis += '• Profile with Unreal Insights\n'
      analysis += '• Check GPU/CPU bottlenecks\n'
    }
    if (draws > 1000) {
      analysis += '• Enable instancing for repeated meshes\n'
      analysis += '• Merge static meshes where possible\n'
    }
    if (tris > 1000000) {
      analysis += '• Implement LOD system\n'
      analysis += '• Use nanite for UE5 projects\n'
    }

    setPerformanceOutput(analysis)
  }

  const generateNamingConvention = () => {
    if (!assetName) {
      setNamingOutput('Please enter an asset name')
      return
    }

    const prefixes: { [key: string]: string } = {
      'Blueprint': 'BP_',
      'Material': 'M_',
      'Texture': 'T_',
      'Static Mesh': 'SM_',
      'Skeletal Mesh': 'SK_',
      'Animation': 'A_',
      'Sound': 'S_',
      'Particle System': 'PS_',
      'Widget': 'W_',
    }

    const prefix = prefixes[assetType] || 'BP_'
    const standardName = prefix + assetName

    const output = `=== Unreal Engine Naming Convention ===

Asset Type: ${assetType}
Prefix: ${prefix}
Standard Name: ${standardName}

Additional Guidelines:
• Use PascalCase for multi-word names
• Keep names descriptive but concise
• Group related assets with common prefixes
• Example: ${prefix}${assetName}_01, ${prefix}${assetName}_Variant

Folder Structure:
Content/
  ├─ ${assetType.replace(' ', '')}s/
  │   └─ ${standardName}

Common Suffixes:
• _Inst (Material Instance)
• _Base (Base material/class)
• _LOD0, _LOD1 (Level of Detail)
• _Phys (Physics asset)`

    setNamingOutput(output)
  }

  const generateMaterialCode = () => {
    const { baseColor, metallic, roughness } = materialParams

    const code = `// Material Parameter Collection Setup
UCLASS()
class UMaterialHelper : public UObject
{
public:
    static void SetMaterialParameters(UMaterialInstanceDynamic* Material)
    {
        if (!Material) return;

        // Set Base Color
        FLinearColor Color = FLinearColor::FromSRGBColor(
            FColor::FromHex(TEXT("${baseColor.substring(1)}"))
        );
        Material->SetVectorParameterValue(TEXT("BaseColor"), Color);

        // Set Metallic
        Material->SetScalarParameterValue(TEXT("Metallic"), ${metallic}f);

        // Set Roughness
        Material->SetScalarParameterValue(TEXT("Roughness"), ${roughness}f);
    }
};

// Blueprint Material Creation
void CreateDynamicMaterial(AActor* Actor)
{
    if (!Actor) return;

    UStaticMeshComponent* MeshComp = Actor->FindComponentByClass<UStaticMeshComponent>();
    if (!MeshComp) return;

    // Create dynamic material instance
    UMaterialInterface* BaseMaterial = MeshComp->GetMaterial(0);
    UMaterialInstanceDynamic* DynMaterial = UMaterialInstanceDynamic::Create(BaseMaterial, Actor);

    // Apply parameters
    UMaterialHelper::SetMaterialParameters(DynMaterial);

    // Set to mesh
    MeshComp->SetMaterial(0, DynMaterial);
}

// Material Properties:
// Base Color: ${baseColor}
// Metallic: ${metallic}
// Roughness: ${roughness}`

    setMaterialOutput(code)
  }

  return (
    <div className="container">
      <header>
        <h1>Unreal Engine Helper Tools</h1>
        <p className="subtitle">Essential utilities for UE developers</p>
      </header>

      <div className="tools-grid">
        <div className="tool-card">
          <h2>C++ Class Generator</h2>
          <p>Generate boilerplate code for Unreal Engine C++ classes</p>
          <div className="input-group">
            <label>Class Name:</label>
            <input
              type="text"
              placeholder="MyActor"
              value={blueprintClass}
              onChange={(e) => setBlueprintClass(e.target.value)}
            />
          </div>
          <button onClick={generateBlueprint}>Generate Class</button>
          {blueprintOutput && (
            <div className="output code-block">
              {blueprintOutput}
            </div>
          )}
        </div>

        <div className="tool-card">
          <h2>Performance Analyzer</h2>
          <p>Analyze your game's performance metrics</p>
          <div className="input-group">
            <label>FPS:</label>
            <input
              type="number"
              placeholder="60"
              value={performanceMetrics.fps}
              onChange={(e) => setPerformanceMetrics({ ...performanceMetrics, fps: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Draw Calls:</label>
            <input
              type="number"
              placeholder="500"
              value={performanceMetrics.drawCalls}
              onChange={(e) => setPerformanceMetrics({ ...performanceMetrics, drawCalls: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Triangle Count:</label>
            <input
              type="number"
              placeholder="1000000"
              value={performanceMetrics.triangles}
              onChange={(e) => setPerformanceMetrics({ ...performanceMetrics, triangles: e.target.value })}
            />
          </div>
          <button onClick={analyzePerformance}>Analyze</button>
          {performanceOutput && (
            <div className="output">
              {performanceOutput}
            </div>
          )}
        </div>

        <div className="tool-card">
          <h2>Naming Convention Helper</h2>
          <p>Generate properly formatted asset names following UE standards</p>
          <div className="input-group">
            <label>Asset Name:</label>
            <input
              type="text"
              placeholder="PlayerCharacter"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Asset Type:</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option>Blueprint</option>
              <option>Material</option>
              <option>Texture</option>
              <option>Static Mesh</option>
              <option>Skeletal Mesh</option>
              <option>Animation</option>
              <option>Sound</option>
              <option>Particle System</option>
              <option>Widget</option>
            </select>
          </div>
          <button onClick={generateNamingConvention}>Generate Name</button>
          {namingOutput && (
            <div className="output">
              {namingOutput}
            </div>
          )}
        </div>

        <div className="tool-card">
          <h2>Material Code Generator</h2>
          <p>Generate C++ code for dynamic material instances</p>
          <div className="input-group">
            <label>Base Color:</label>
            <input
              type="color"
              value={materialParams.baseColor}
              onChange={(e) => setMaterialParams({ ...materialParams, baseColor: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Metallic (0-1):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={materialParams.metallic}
              onChange={(e) => setMaterialParams({ ...materialParams, metallic: e.target.value })}
            />
            <span style={{ color: '#00d9ff', fontSize: '0.9rem' }}>{materialParams.metallic}</span>
          </div>
          <div className="input-group">
            <label>Roughness (0-1):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={materialParams.roughness}
              onChange={(e) => setMaterialParams({ ...materialParams, roughness: e.target.value })}
            />
            <span style={{ color: '#00d9ff', fontSize: '0.9rem' }}>{materialParams.roughness}</span>
          </div>
          <button onClick={generateMaterialCode}>Generate Code</button>
          {materialOutput && (
            <div className="output code-block">
              {materialOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
